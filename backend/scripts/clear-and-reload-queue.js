/**
 * Script to clear the queue and re-add all posts directly from the database
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/post');

// Helper function to wait for a specified time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function clearAndReloadQueue() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Step 1: Find all posts that need to be processed
    const posts = await Post.find({ photo: { $exists: true, $ne: null } });
    console.log(`Found ${posts.length} posts with photos`);

    // Step 2: Clear the queue status for all posts (set them as not queued)
    console.log('Clearing existing queue status for all posts...');
    const clearResult = await Post.updateMany(
      {}, // match all posts
      { 
        $set: { 
          isQueued: false, 
          isClassified: false,
          classificationFailed: false
        },
        $unset: {
          classifierResults: "",
          classificationError: ""
        }
      }
    );
    console.log(`Queue cleared. Modified ${clearResult.modifiedCount} posts.`);

    // Step 3: Re-add posts to queue by marking them as queued with waitForModel=true
    console.log('Re-adding posts to queue with waitForModel=true...');
    let successCount = 0;
    let failCount = 0;

    for (const post of posts) {
      try {
        const updateResult = await Post.updateOne(
          { _id: post._id },
          { 
            $set: { 
              isQueued: true,
              waitForModel: true  // Set waitForModel flag to true
            } 
          }
        );
        
        if (updateResult.modifiedCount === 1) {
          console.log(`Post ${post._id} added to queue with waitForModel=true`);
          successCount++;
        } else {
          console.log(`Failed to add post ${post._id} to queue`);
          failCount++;
        }
      } catch (error) {
        console.error(`Error adding post ${post._id} to queue:`, error.message);
        failCount++;
      }
    }

    // Step 4: Display summary
    console.log('\nQueue Reload Summary:');
    console.log(`Total posts: ${posts.length}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    // Wait for a moment for database to sync
    console.log('\nWaiting for database to sync...');
    await wait(2000);

    // Step 5: Directly count posts with different queue statuses
    const queuedCount = await Post.countDocuments({ isQueued: true });
    const classifiedCount = await Post.countDocuments({ isClassified: true });
    const failedCount = await Post.countDocuments({ classificationFailed: true });
    const totalCount = await Post.countDocuments();

    console.log('\nFinal Queue Status:');
    console.log('--------------------------');
    console.log(`Queued: ${queuedCount}`);
    console.log(`Classified: ${classifiedCount}`);
    console.log(`Failed: ${failedCount}`);
    console.log('--------------------------');
    console.log(`Total posts: ${totalCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
clearAndReloadQueue(); 