const { exec } = require('child_process');
const path = require('path');

/**
 * Get a BLIP caption for an image by running the Python script
 * @param {string} source - URL or file path to the image
 * @returns {Promise<string>} - The generated caption
 */
function getBlipCaptionLocally(source) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'classify.py');
    
    exec(`python3 ${scriptPath} "${source}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`BLIP Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`BLIP stderr: ${stderr}`);
      }
      
      resolve(stdout.trim());
    });
  });
}

module.exports = getBlipCaptionLocally;