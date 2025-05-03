/**
 * Script to send all existing posts to the classifier queue
 */
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Post = require('../models/post');

const CLASSIFIER_URL = process.env.NODE_ENV === 'production'
  ? 'https://authentra-backend.onrender.com/api/queue'
  : 'http://localhost:4000/api/queue';

async function sendPostsToClassifier() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all posts with photos
    const posts = await Post.find({ photo: { $exists: true, $ne: null } });
    console.log(`Found ${posts.length} posts with photos`);

    // Send each post to the classifier
    let successCount = 0;
    let failCount = 0;

    for (const post of posts) {
      try {
        console.log(`Sending post ${post._id} to classifier...`);
        const response = await axios.post(CLASSIFIER_URL, { postId: post._id.toString() });
        console.log(`Response: ${JSON.stringify(response.data)}`);
        successCount++;
      } catch (error) {
        console.error(`Error sending post ${post._id} to classifier:`, error.message);
        failCount++;
      }
    }

    console.log('\nSummary:');
    console.log(`Total posts: ${posts.length}`);
    console.log(`Successfully sent: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
sendPostsToClassifier(); 