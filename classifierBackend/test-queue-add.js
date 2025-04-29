require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

async function addPostsToQueue() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check command line args
    const args = process.argv.slice(2);
    const forceAll = args.includes('--force-all');
    const specificPostId = args.find(arg => arg.startsWith('--post='))?.split('=')[1];
    
    let query = { photo: { $exists: true, $ne: null } };
    
    // If not force all, only get unprocessed posts
    if (!forceAll) {
      query.processed = false;
      query.processingFailed = false;
    }
    
    // If specific post ID, filter for that one
    if (specificPostId) {
      query = { _id: specificPostId };
    }
    
    // Find posts matching the query
    const posts = await Post.find(query);
    
    if (specificPostId && posts.length === 0) {
      console.error(`Post with ID ${specificPostId} not found`);
      return;
    }
    
    const mode = forceAll ? 'all' : 'unprocessed';
    console.log(`Found ${posts.length} ${mode} posts with photos`);
    
    // Add each post to the queue if not already queued
    let addedCount = 0;
    let alreadyQueuedCount = 0;
    
    for (const post of posts) {
      // Check if this post is already in the queue
      const existing = await ImageQueue.findOne({ imageId: post._id });
      
      if (!existing) {
        // Add to queue
        const queueItem = new ImageQueue({
          imageId: post._id,
          status: 'queued',
          retries: 0
        });
        
        await queueItem.save();
        addedCount++;
        console.log(`Added post ${post._id} to queue`);
      } else {
        alreadyQueuedCount++;
        console.log(`Post ${post._id} already in queue with status: ${existing.status}`);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Found: ${posts.length} posts`);
    console.log(`- Added to queue: ${addedCount} posts`);
    console.log(`- Already in queue: ${alreadyQueuedCount} posts`);
    
    // Display queue status
    const queueStats = {
      queued: await ImageQueue.countDocuments({ status: 'queued' }),
      processing: await ImageQueue.countDocuments({ status: 'processing' }),
      done: await ImageQueue.countDocuments({ status: 'done' }),
      failed: await ImageQueue.countDocuments({ status: 'failed' })
    };
    
    console.log(`\nCurrent queue status:`);
    console.log(queueStats);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Usage information
function printUsage() {
  console.log('Usage:');
  console.log('  node test-queue-add.js               # Add unprocessed posts to queue');
  console.log('  node test-queue-add.js --force-all   # Add all posts to queue, regardless of processed status');
  console.log('  node test-queue-add.js --post=123    # Add specific post with ID 123 to queue');
}

// Check if help was requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage();
} else {
  // Run the function
  addPostsToQueue();
} 