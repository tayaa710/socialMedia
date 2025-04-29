require('dotenv').config();
const mongoose = require('mongoose');
const ImageQueue = require('./models/ImageQueue');
const Post = require('./models/post');

async function checkQueueStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get queue stats
    const queuedCount = await ImageQueue.countDocuments({ status: 'queued' });
    const processingCount = await ImageQueue.countDocuments({ status: 'processing' });
    const doneCount = await ImageQueue.countDocuments({ status: 'done' });
    const failedCount = await ImageQueue.countDocuments({ status: 'failed' });
    
    console.log('Queue Status:');
    console.log(`- Queued: ${queuedCount}`);
    console.log(`- Processing: ${processingCount}`);
    console.log(`- Done: ${doneCount}`);
    console.log(`- Failed: ${failedCount}`);
    console.log(`- Total: ${queuedCount + processingCount + doneCount + failedCount}`);
    
    // Show the last 5 processed posts
    if (doneCount > 0) {
      console.log('\nLast 5 processed posts:');
      
      const doneJobs = await ImageQueue.find({ status: 'done' })
        .sort({ updatedAt: -1 })
        .limit(5);
      
      for (const job of doneJobs) {
        const post = await Post.findById(job.imageId);
        if (post) {
          console.log(`- Post ${post._id}: "${post.caption?.substring(0, 50)}${post.caption?.length > 50 ? '...' : ''}"`);
        } else {
          console.log(`- Post ${job.imageId}: (post not found)`);
        }
      }
    }
    
    // Show failed jobs if any
    if (failedCount > 0) {
      console.log('\nFailed jobs:');
      const failedJobs = await ImageQueue.find({ status: 'failed' })
        .sort({ updatedAt: -1 })
        .limit(5);
      
      for (const job of failedJobs) {
        console.log(`- Job ${job._id} for post ${job.imageId}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
checkQueueStatus(); 