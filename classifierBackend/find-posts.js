require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');

async function findAvailablePosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all posts with photos
    const allPosts = await Post.find({ 
      photo: { $exists: true, $ne: null }
    }).sort({ createdAt: -1 }).limit(10);
    
    console.log(`\nFound ${allPosts.length} posts with photos (showing most recent 10):`);
    
    for (const post of allPosts) {
      const status = post.processed 
        ? (post.processingFailed ? 'FAILED' : 'PROCESSED') 
        : 'UNPROCESSED';
        
      console.log(`- Post ID: ${post._id}`);
      console.log(`  Status: ${status}`);
      console.log(`  Photo: ${post.photo.substring(0, 50)}${post.photo.length > 50 ? '...' : ''}`);
      console.log(`  Created: ${post.createdAt}`);
      if (post.caption) {
        console.log(`  Caption: ${post.caption.substring(0, 50)}${post.caption.length > 50 ? '...' : ''}`);
      }
      console.log('');
    }
    
    // Find unprocessed posts
    const unprocessedPosts = await Post.find({ 
      photo: { $exists: true, $ne: null },
      processed: false,
      processingFailed: false
    }).countDocuments();
    
    console.log(`Total unprocessed posts: ${unprocessedPosts}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
findAvailablePosts(); 