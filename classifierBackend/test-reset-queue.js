require('dotenv').config();
const mongoose = require('mongoose');
const ImageQueue = require('./models/ImageQueue');
const Post = require('./models/post');

async function resetFailedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all failed jobs
    const failedJobs = await ImageQueue.find({ status: 'failed' });
    console.log(`Found ${failedJobs.length} failed jobs`);
    
    // Reset their status to 'queued'
    if (failedJobs.length > 0) {
      const result = await ImageQueue.updateMany(
        { status: 'failed' },
        { status: 'queued' }
      );
      
      console.log(`Reset ${result.modifiedCount} jobs to 'queued'`);
      
      // Also reset the posts' processingFailed flag
      for (const job of failedJobs) {
        await Post.findByIdAndUpdate(job.imageId, {
          processingFailed: false
        });
      }
      
      console.log('All failed posts have been reset and are ready for reprocessing');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

async function resetStuckJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find jobs that have been in 'processing' state for too long (more than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const stuckJobs = await ImageQueue.find({
      status: 'processing',
      updatedAt: { $lt: fiveMinutesAgo }
    });
    
    console.log(`Found ${stuckJobs.length} stuck jobs in 'processing' state`);
    
    // Reset their status to 'queued'
    if (stuckJobs.length > 0) {
      const result = await ImageQueue.updateMany(
        { 
          status: 'processing',
          updatedAt: { $lt: fiveMinutesAgo }
        },
        { status: 'queued' }
      );
      
      console.log(`Reset ${result.modifiedCount} stuck jobs to 'queued'`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Choose which reset function to run
const args = process.argv.slice(2);

if (args[0] === 'stuck') {
  resetStuckJobs();
} else if (args[0] === 'failed') {
  resetFailedJobs();
} else {
  console.log('Usage: node test-reset-queue.js [stuck|failed]');
  console.log('  - stuck: Reset processing jobs that have been stuck');
  console.log('  - failed: Reset failed jobs to queued state');
} 