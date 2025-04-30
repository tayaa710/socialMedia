require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');

async function checkAllCaptionedPosts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all processed posts
    const processedPosts = await Post.find({ 
      processed: true,
      'imageAnalysis.caption': { $exists: true, $ne: null }
    }).sort({ updatedAt: -1 });
    
    console.log(`\nFound ${processedPosts.length} posts with captions:`);
    console.log('----------------------------------------------------');
    
    // Display information for each post
    for (const post of processedPosts) {
      console.log(`\nPost ID: ${post._id}`);
      console.log(`User: ${post.user}`);
      console.log(`Created: ${post.createdAt}`);
      console.log(`Updated: ${post.updatedAt}`);
      console.log(`Photo: ${post.photo.substring(0, 60)}...`);
      console.log(`Caption: "${post.imageAnalysis?.caption}"`);
      
      if (post.description) {
        console.log(`Description: "${post.description}"`);
      }
      
      console.log('----------------------------------------------------');
    }
    
    // Find all failed posts
    const failedPosts = await Post.find({ processingFailed: true });
    
    if (failedPosts.length > 0) {
      console.log(`\nFound ${failedPosts.length} posts that failed processing:`);
      console.log('----------------------------------------------------');
      
      for (const post of failedPosts) {
        console.log(`Post ID: ${post._id}`);
        console.log(`User: ${post.user}`);
        console.log(`Created: ${post.createdAt}`);
        console.log('----------------------------------------------------');
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
checkAllCaptionedPosts(); 