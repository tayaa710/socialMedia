require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');

// IDs of the posts that were processed by the classifier
const postIds = [
  '68102979f3395d6465df181f',
  '68102976f3395d6465df17fe',
  '68102977f3395d6465df1806'
];

async function checkCaptionedPosts() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('\nChecking posts that were processed by the classifier:');
    console.log('----------------------------------------------------');
    
    // Check each post
    for (const postId of postIds) {
      const post = await Post.findById(postId);
      
      if (!post) {
        console.log(`Post ${postId}: Not found`);
        continue;
      }
      
      console.log(`\nPost ID: ${post._id}`);
      console.log(`User: ${post.user}`);
      console.log(`Photo: ${post.photo.substring(0, 60)}...`);
      
      // Check if the post has been processed
      if (post.processed) {
        console.log(`Status: PROCESSED ✅`);
        console.log(`Caption: "${post.caption}"`);
        
        if (post.imageAnalysis) {
          console.log(`Image Analysis: ${JSON.stringify(post.imageAnalysis, null, 2)}`);
        }
      } else if (post.processingFailed) {
        console.log(`Status: FAILED ❌`);
      } else {
        console.log(`Status: NOT PROCESSED`);
      }
      
      console.log('----------------------------------------------------');
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
checkCaptionedPosts(); 