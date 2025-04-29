require('dotenv').config();
const mongoose = require('mongoose');
const ImageQueue = require('./models/ImageQueue');
const Post = require('./models/post');

async function resetQueueItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const mode = process.argv[2] || 'all';
    
    let query = {};
    
    // Handle different reset modes
    if (mode === 'failed') {
      query = { status: 'failed' };
    } else if (mode === 'stuck') {
      // Find jobs that got stuck in 'processing' state (stuck for more than 30 minutes)
      query = { 
        status: 'processing', 
        updatedAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } 
      };
    } else if (mode === 'all') {
      // Reset all non-done jobs
      query = { status: { $ne: 'done' } };
    } else {
      console.error('Invalid mode. Use: failed, stuck, or all');
      process.exit(1);
    }
    
    // Count jobs before reset
    const count = await ImageQueue.countDocuments(query);
    console.log(`Found ${count} jobs to reset (mode: ${mode})`);
    
    if (count === 0) {
      console.log('No jobs to reset');
      return;
    }
    
    // Reset jobs
    const result = await ImageQueue.updateMany(
      query,
      { 
        status: 'queued',
        $unset: { error: "" },
        // Don't reset retries count if in 'stuck' mode
        ...(mode !== 'stuck' ? { retries: 0 } : {})
      }
    );
    
    console.log(`Reset ${result.modifiedCount} jobs to 'queued' status`);
    
    // Also reset posts that were marked as failed
    if (mode === 'failed' || mode === 'all') {
      const postResult = await Post.updateMany(
        { processingFailed: true },
        { processingFailed: false, processed: false }
      );
      
      console.log(`Reset ${postResult.modifiedCount} posts from 'failed' to 'unprocessed'`);
    }
    
    // Print some stats
    const stats = {
      queued: await ImageQueue.countDocuments({ status: 'queued' }),
      processing: await ImageQueue.countDocuments({ status: 'processing' }),
      done: await ImageQueue.countDocuments({ status: 'done' }),
      failed: await ImageQueue.countDocuments({ status: 'failed' })
    };
    
    console.log('\nQueue status after reset:');
    console.table(stats);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

resetQueueItems(); 