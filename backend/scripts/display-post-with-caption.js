require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');

// ID of a post to check (can be passed as a command line argument)
const postId = process.argv[2] || '68102979f3395d6465df181f';

async function displayPostWithCaption() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the post without populating user
    const post = await Post.findById(postId);
    
    if (!post) {
      console.log(`Post ${postId} not found`);
      return;
    }
    
    // Display the post in JSON format with indentation
    console.log('\nPost Details:');
    console.log('----------------------------------------------------');
    
    // Create a clean representation of the post
    const cleanPost = {
      id: post._id,
      userId: post.user,
      description: post.description || '',
      photo: post.photo,
      caption: post.caption || 'No caption available',
      processed: post.processed || false,
      processingFailed: post.processingFailed || false,
      imageAnalysis: post.imageAnalysis || null,
      likes: post.likes ? post.likes.length : 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
    
    // Display the clean post
    console.log(JSON.stringify(cleanPost, null, 2));
    
    console.log('\nThis is how the post would appear in the API response');
    console.log('----------------------------------------------------');
    
    // Examples of how you might display the caption in your frontend
    console.log('\nFrontend Display Examples:');
    console.log('----------------------------------------------------');
    console.log('1. Caption Only:');
    console.log(`"${cleanPost.caption}"`);
    
    console.log('\n2. Caption with Attribution:');
    console.log(`"${cleanPost.caption}" - AI Caption`);
    
    console.log('\n3. User Description + Caption:');
    if (cleanPost.description) {
      console.log(`User: "${cleanPost.description}"`);
      console.log(`AI: "${cleanPost.caption}"`);
    } else {
      console.log(`AI Caption: "${cleanPost.caption}"`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
displayPostWithCaption(); 