require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

async function resetAndRequeuePosts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all posts that have been processed
    const posts = await Post.find({
      $or: [
        // Only target posts that have actually been processed
        { processed: true },
        { processingFailed: true },
        { imageAnalysis: { $exists: true, $ne: null } },
        { caption: { $exists: true, $ne: null } },
        { categories: { $exists: true, $ne: [] } }
      ]
    });
    
    console.log(`Found ${posts.length} posts to reset`);
    
    // Reset all posts
    let count = 0;
    for (const post of posts) {
      // Remove fields from the post
      post.imageAnalysis = null;
      post.processed = false;
      post.processingFailed = false;
      post.caption = null;
      post.categories = [];
      
      await post.save();
      count++;
      
      if (count % 10 === 0) {
        console.log(`Reset ${count} posts so far...`);
      }
    }
    
    console.log(`Successfully reset ${count} posts`);
    
    // Clean up any existing 'done' queue items
    const doneQueueResult = await ImageQueue.deleteMany({ status: 'done' });
    console.log(`Deleted ${doneQueueResult.deletedCount} completed queue items`);
    
    // Remove any existing failed or processing queue items
    const existingQueueResult = await ImageQueue.deleteMany({ 
      status: { $in: ['failed', 'processing'] } 
    });
    console.log(`Deleted ${existingQueueResult.deletedCount} failed/processing queue items`);
    
    // Add all posts to the queue (avoiding duplicates)
    let queueCount = 0;
    
    for (const post of posts) {
      // Check if post is already in queue
      const existingQueueItem = await ImageQueue.findOne({ 
        imageId: post.id,
        status: 'queued'
      });
      
      if (!existingQueueItem) {
        // Create a new queue item for this post
        const queueItem = new ImageQueue({
          imageId: post.id,
          status: 'queued'
        });
        
        await queueItem.save();
        queueCount++;
        
        if (queueCount % 10 === 0) {
          console.log(`Added ${queueCount} posts to queue so far...`);
        }
      }
    }
    
    console.log(`Successfully added ${queueCount} new posts to processing queue`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
resetAndRequeuePosts().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 