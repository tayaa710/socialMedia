require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

// Specify the post ID to queue
const postId = process.argv[2];

async function addSpecificPostToQueue() {
  if (!postId) {
    console.error('Error: Post ID is required');
    console.log('Usage: node test-add-specific-post.js <postId>');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the specific post
    const post = await Post.findById(postId);
    
    if (!post) {
      console.error(`Post with ID ${postId} not found`);
      process.exit(1);
    }
    
    // Verify it has a photo
    if (!post.photo) {
      console.error(`Post ${postId} does not have a photo`);
      process.exit(1);
    }
    
    // Check if this post is already in the queue
    const existing = await ImageQueue.findOne({ imageId: post._id });
    
    if (existing) {
      console.log(`Post ${post._id} is already in queue with status: ${existing.status}`);
      
      // Ask if user wants to reset the status
      if (existing.status !== 'queued') {
        console.log('Do you want to reset the status to "queued"? (Y/n)');
        
        // Since we can't easily get user input in this script, we'll automatically reset it
        await ImageQueue.findByIdAndUpdate(existing._id, { status: 'queued' });
        console.log(`Reset job ${existing._id} status to "queued"`);
        
        // Also reset the post's processing flags
        await Post.findByIdAndUpdate(post._id, {
          processingFailed: false
        });
      }
    } else {
      // Add to queue
      const queueItem = new ImageQueue({
        imageId: post._id,
        status: 'queued'
      });
      
      await queueItem.save();
      console.log(`Added post ${post._id} to queue with job ID ${queueItem._id}`);
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
addSpecificPostToQueue(); 