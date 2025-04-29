const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const http = require('http');

// Server configuration
const SERVER_PORT = 8000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
let serverProcess = null;
let serverStarting = false;

/**
 * Ensure the Python server is running
 * @returns {Promise} Resolves when server is ready
 */
function ensureServerRunning() {
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
    
    // Start the Python server
    const scriptPath = path.join(__dirname, '..', 'classify.py');
    const venvPythonPath = path.join(__dirname, '..', 'venv', 'bin', 'python');
    
    serverProcess = spawn(venvPythonPath, [scriptPath], {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
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
 * @returns {Promise<Object>} - Object containing caption and categories
 */
async function processImageLocally(source) {
  try {
    // Ensure server is running
    await ensureServerRunning();
    
    // Make API request to local server
    const encodedSource = encodeURIComponent(source);
    const response = await axios.get(`${SERVER_URL}/classify?image=${encodedSource}`, {
      timeout: 120000 // 2 minute timeout
    });
    
    return response.data;
  } catch (error) {
    console.error(`Image processing error: ${error.message}`);
    
    // If server communication failed, fallback to direct execution
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('Server connection failed, falling back to direct execution');
      return processImageWithDirectExecution(source);
    }
    
    throw error;
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
    
    exec(`${venvPythonPath} ${scriptPath} "${source}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Image Processing Error: ${error.message}`);
        return reject(error);
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
    .then(result => result.caption);
}

// Clean up server on process exit
process.on('exit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

module.exports = {
  getBlipCaptionLocally,
  processImageLocally
};