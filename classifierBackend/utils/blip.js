const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

// Server configuration
const SERVER_PORT = 8000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
let serverProcess = null;
let serverStarting = false;
const MODEL_LOAD_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const STATUS_CHECK_TIMEOUT = 30000; // 30 seconds
const SERVER_START_TIMEOUT = 120000; // 2 minutes

/**
 * Polls the server status until the model is ready or an error occurs
 * @returns {Promise} Resolves when model is ready, rejects on timeout or error
 */
async function waitForModelReady() {
  console.log('Waiting for BLIP model to be fully loaded...');
  
  // Add an initial delay to give the server time to start
  console.log('Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second initial delay
  
  // Check status until model is ready
  while (true) {
    try {
      const response = await axios.get(`${SERVER_URL}/status`);
      const status = response.data;
      
      if (status.status === 'loaded') {
        console.log('BLIP model is now ready!');
        return true;
      } else if (status.status === 'error') {
        throw new Error(`Model failed to load: ${status.error}`);
      }
      
      // If still loading, log progress
      if (status.status === 'loading') {
        console.log(`Model loading progress: ${status.progress}%`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('Server not responding yet, will retry...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else {
        throw error;
      }
    }
  }
}

/**
 * Ensure the Python server is running
 * @returns {Promise} Resolves when server is ready
 */
async function ensureServerRunning() {
  return new Promise((resolve, reject) => {
    // If server already running, return immediately
    if (serverProcess && !serverProcess.killed) {
      return resolve();
    }
    
    // If server is in the process of starting, wait
    if (serverStarting) {
      const checkInterval = setInterval(() => {
        if (serverProcess && !serverStarting) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
      return;
    }
    
    console.log('Starting Python image classification server...');
    serverStarting = true;
    
    // Make sure the virtual environment exists
    const venvPath = path.join(__dirname, '..', 'venv');
    const venvPythonPath = path.join(venvPath, 'bin', 'python');
    const scriptPath = path.join(__dirname, '..', 'classify.py');
    
    if (!fs.existsSync(venvPythonPath)) {
      console.log('Python virtual environment not found, using system Python');
      // Use system Python as fallback
      serverProcess = spawn('python3', [scriptPath], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    } else {
      serverProcess = spawn(venvPythonPath, [scriptPath], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
      });
    }
    
    // Log output from the server
    serverProcess.stdout.on('data', (data) => {
      console.log(`Python server: ${data.toString().trim()}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Python server error: ${data.toString().trim()}`);
    });
    
    // Handle server exit
    serverProcess.on('exit', (code) => {
      console.log(`Python server exited with code ${code}`);
      serverProcess = null;
      serverStarting = false;
      
      // If abnormal exit and not shutting down, restart server
      if (code !== 0) {
        console.log('Server crashed, will restart on next request');
      }
    });
    
    // Wait a few seconds, then start checking if the server is responding
    setTimeout(() => {
      // Set up an interval to check if the server is responding
      const checkServerInterval = setInterval(async () => {
        try {
          // Try to connect to the server
          await axios.get(`${SERVER_URL}/status`, { timeout: 2000 });
          
          // If we get here, the server is responding
          clearInterval(checkServerInterval);
          serverStarting = false;
          console.log('Python server is now responding to requests');
          resolve();
        } catch (error) {
          // Server not responding yet, will retry
          console.log('Waiting for Python server to start...');
        }
      }, 2000);
      
      // If server doesn't respond within 2 minutes, consider it failed
      setTimeout(() => {
        clearInterval(checkServerInterval);
        if (serverStarting) {
          serverStarting = false;
          reject(new Error('Server startup timed out'));
        }
      }, SERVER_START_TIMEOUT);
    }, 5000); // Wait 5 seconds before starting to check
  });
}

/**
 * Process an image using our AI model to get caption and categories
 * @param {string} source - URL or file path to the image
 * @param {boolean} waitForModel - Whether to wait for model to load if not ready
 * @returns {Promise<Object>} - Object containing caption and categories
 */
async function processImageLocally(source, waitForModel = true) {
  try {
    // Ensure server is running
    await ensureServerRunning();
    
    // Check model status
    let modelReady = false;
    
    try {
      const statusResponse = await axios.get(`${SERVER_URL}/status`);
      if (statusResponse.data.status === 'loaded') {
        modelReady = true;
      } else if (waitForModel && statusResponse.data.status === 'loading') {
        // If we should wait for the model, do so
        await waitForModelReady();
        modelReady = true;
      }
    } catch (error) {
      console.error(`Error checking model status: ${error.message}`);
    }
    
    if (!modelReady && !waitForModel) {
      return {
        error: "Model is not ready yet, and wait flag was not set",
        caption: null,
        categories: []
      };
    }
    
    // Attempt to process the image
    const encodedSource = encodeURIComponent(source);
    const response = await axios.get(
      `${SERVER_URL}/classify?image=${encodedSource}`
    );
    
    if (response.data.error) {
      console.error(`Error from server: ${response.data.error}`);
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Image processing error: ${error.message}`);
    
    // If server communication failed, fallback to direct execution
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('Server connection failed, falling back to direct execution');
      return processImageWithDirectExecution(source);
    }
    
    return {
      error: `Failed to process image: ${error.message}`,
      caption: null,
      categories: []
    };
  }
}

/**
 * Fallback function that directly executes the Python script (old method)
 * @param {string} source - URL or file path to the image
 * @returns {Promise<Object>} - Object containing caption and categories
 */
function processImageWithDirectExecution(source) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'classify.py');
    const venvPythonPath = path.join(__dirname, '..', 'venv', 'bin', 'python');
    
    // Check if venv exists, use system Python if not
    const pythonCmd = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python3';
    
    console.log(`Running direct execution with: ${pythonCmd} ${scriptPath} "${source}"`);
    
    exec(`${pythonCmd} ${scriptPath} "${source}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Image Processing Error: ${error.message}`);
        return resolve({
          error: error.message,
          caption: null,
          categories: []
        });
      }
      if (stderr) {
        console.error(`Image Processing stderr: ${stderr}`);
      }
      
      // Find the JSON output in the script's output
      const jsonStartIndex = stdout.indexOf('JSON OUTPUT:');
      if (jsonStartIndex !== -1) {
        try {
          const jsonStr = stdout.substring(jsonStartIndex + 'JSON OUTPUT:'.length).trim();
          const result = JSON.parse(jsonStr);
          resolve(result);
        } catch (parseError) {
          console.error('Error parsing JSON output:', parseError);
          // Fallback to old behavior if JSON parsing fails
          resolve({ caption: stdout.trim(), categories: [] });
        }
      } else {
        // Fallback to old behavior if no JSON is found
        resolve({ caption: stdout.trim(), categories: [] });
      }
    });
  });
}

/**
 * Legacy function that only returns the caption (for backward compatibility)
 * @param {string} source - URL or file path to the image
 * @returns {Promise<string>} - The generated caption
 */
function getBlipCaptionLocally(source) {
  return processImageLocally(source)
    .then(result => result.caption || null);
}

// Clean up server on process exit
process.on('exit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

module.exports = {
  getBlipCaptionLocally,
  processImageLocally,
  waitForModelReady
};