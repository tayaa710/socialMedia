require('dotenv').config();
const mongoose = require('mongoose');
const ImageQueue = require('./models/ImageQueue');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Function to reset queue items based on status
async function resetQueueItems(status) {
  let filter = {};
  let message = '';

  if (status === 'failed') {
    filter = { status: 'failed' };
    message = 'Resetting failed jobs to queued status';
  } else if (status === 'stuck') {
    filter = { 
      status: 'processing', 
      updatedAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } 
    };
    message = 'Resetting stuck processing jobs to queued status';
  } else if (status === 'all') {
    filter = { status: { $in: ['failed', 'processing'] } };
    message = 'Resetting all failed and stuck jobs to queued status';
  } else {
    console.error('Invalid status. Use: failed, stuck, or all');
    process.exit(1);
  }

  console.log(message);
  
  const result = await ImageQueue.updateMany(
    filter,
    { 
      status: 'queued',
      $unset: { error: "" } 
    }
  );

  console.log(`Reset ${result.modifiedCount} jobs to queued status`);
}

// Function to display queue status
async function showQueueStatus() {
  const stats = {
    queued: await ImageQueue.countDocuments({ status: 'queued' }),
    processing: await ImageQueue.countDocuments({ status: 'processing' }),
    done: await ImageQueue.countDocuments({ status: 'done' }),
    failed: await ImageQueue.countDocuments({ status: 'failed' }),
    total: await ImageQueue.countDocuments({})
  };
  
  console.log('Current Queue Status:');
  console.log('--------------------');
  console.log(`Queued: ${stats.queued}`);
  console.log(`Processing: ${stats.processing}`);
  console.log(`Done: ${stats.done}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Total: ${stats.total}`);
}

// Main function
async function main() {
  await connectDB();

  const command = process.argv[2] || 'status';
  
  if (command === 'status') {
    await showQueueStatus();
  } else if (['failed', 'stuck', 'all'].includes(command)) {
    await resetQueueItems(command);
    await showQueueStatus();
  } else {
    console.log('Invalid command. Usage:');
    console.log('  node reset-queue.js status   - Show queue status');
    console.log('  node reset-queue.js failed   - Reset failed jobs');
    console.log('  node reset-queue.js stuck    - Reset stuck processing jobs');
    console.log('  node reset-queue.js all      - Reset all failed and stuck jobs');
  }

  // Close the database connection
  mongoose.connection.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 