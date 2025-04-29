require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

// Number of posts to add to the queue
const LIMIT = 3;

async function addLimitedPostsToQueue() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find unprocessed posts with photos
    const posts = await Post.find({ 
      photo: { $exists: true },
      processed: false,
      processingFailed: false
    }).limit(LIMIT);
    
    console.log(`Found ${posts.length} unprocessed posts with photos (limited to ${LIMIT})`);
    
    // Add each post to the queue if not already queued
    let addedCount = 0;
    for (const post of posts) {
      // Check if this post is already in the queue
      const existing = await ImageQueue.findOne({ imageId: post._id });
      
      if (!existing) {
        // Add to queue
        const queueItem = new ImageQueue({
          imageId: post._id,
          status: 'queued'
        });
        
        await queueItem.save();
        addedCount++;
        console.log(`Added post ${post._id} to queue`);
      } else {
        console.log(`Post ${post._id} already in queue with status: ${existing.status}`);
      }
    }
    
    console.log(`Added ${addedCount} posts to the processing queue`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
addLimitedPostsToQueue(); 