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
const MODEL_LOAD_TIMEOUT = 10 * 60 * 1000; // 10 minutes

/**
 * Polls the server status until the model is ready or an error occurs
 * @returns {Promise} Resolves when model is ready, rejects on timeout or error
 */
async function waitForModelReady() {
  console.log('Waiting for BLIP model to be fully loaded...');
  const startTime = Date.now();
  
  // Check status every 10 seconds
  while (Date.now() - startTime < MODEL_LOAD_TIMEOUT) {
    try {
      const response = await axios.get(`${SERVER_URL}/status`, { timeout: 5000 });
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
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('Server not responding yet, will retry...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Timed out waiting for model to load');
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
      
      // Detect when server is ready
      if (data.toString().includes('Starting image classifier server')) {
        serverStarting = false;
        resolve();
      }
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
    
    // If server doesn't start within 60 seconds, consider it failed
    setTimeout(() => {
      if (serverStarting) {
        serverStarting = false;
        reject(new Error('Server startup timed out'));
      }
    }, 60000);
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
      const statusResponse = await axios.get(`${SERVER_URL}/status`, { timeout: 5000 });
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
      `${SERVER_URL}/classify?image=${encodedSource}`, 
      { timeout: 180000 } // 3 minute timeout for image processing
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