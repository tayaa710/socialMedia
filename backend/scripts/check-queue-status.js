/**
 * Script to check the status of the classifier queue
 */
const axios = require('axios');
require('dotenv').config();

const CLASSIFIER_STATUS_URL = process.env.NODE_ENV === 'production'
  ? 'https://authentra-backend.onrender.com/api/queue/status'
  : 'http://localhost:4000/api/queue/status';

async function checkQueueStatus() {
  try {
    console.log('Checking classifier queue status...');
    const response = await axios.get(CLASSIFIER_STATUS_URL);
    
    console.log('\nQueue Status:');
    console.log('--------------------------');
    console.log(`Queued: ${response.data.queued}`);
    console.log(`Processing: ${response.data.processing}`);
    console.log(`Completed: ${response.data.done}`);
    console.log(`Failed: ${response.data.failed}`);
    console.log('--------------------------');
    console.log(`Total: ${response.data.queued + response.data.processing + response.data.done + response.data.failed}`);
    
  } catch (error) {
    console.error('Error checking queue status:', error.message);
    console.error('Make sure the classifier API server is running on http://localhost:4000');
  }
}

// Run the function
checkQueueStatus(); 