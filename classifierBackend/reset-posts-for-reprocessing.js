require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

async function resetAllPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all posts with photos
    const posts = await Post.find({
      photo: { $exists: true, $ne: null }
    });
    
    console.log(`Found ${posts.length} posts with photos`);
    
    // Reset each post
    let updatedCount = 0;
    for (const post of posts) {
      // Reset the post fields
      post.caption = null;
      post.categories = [];
      post.imageAnalysis = null;
      post.processed = false;
      post.processingFailed = false;
      
      await post.save();
      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`Processed ${updatedCount}/${posts.length} posts...`);
      }
    }
    
    console.log(`Reset ${updatedCount} posts to unprocessed state`);
    
    // Clear the queue
    const queueResult = await ImageQueue.deleteMany({});
    console.log(`Removed ${queueResult.deletedCount} items from the queue`);
    
    console.log('All posts have been reset and the queue has been cleared');
    console.log('Run test-queue-add.js to add all unprocessed posts to the queue again');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

resetAllPosts(); 