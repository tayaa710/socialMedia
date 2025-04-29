require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Reset post captions and add them back to the queue
async function resetCaptions() {
  try {
    console.log('Starting caption reset process...');
    
    // Find all posts with photos
    const posts = await Post.find({ photo: { $exists: true, $ne: null } });
    console.log(`Found ${posts.length} posts with photos`);
    
    // Clear existing queue
    await ImageQueue.deleteMany({});
    console.log('Cleared existing image queue');
    
    // Reset captions and requeue posts
    let count = 0;
    for (const post of posts) {
      // Reset post data
      post.caption = null;
      post.categories = [];
      post.imageAnalysis = null;
      post.processed = false;
      post.processingFailed = false;
      await post.save();
      
      // Add to queue
      const queueItem = new ImageQueue({
        imageId: post._id,
        status: 'queued'
      });
      await queueItem.save();
      
      count++;
      if (count % 10 === 0) {
        console.log(`Processed ${count}/${posts.length} posts`);
      }
    }
    
    console.log(`Successfully reset and requeued ${count} posts`);
    console.log('You can now start the queue worker to process them');
    
  } catch (error) {
    console.error('Error resetting captions:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
connectDB()
  .then(resetCaptions)
  .catch(error => {
    console.error('Script error:', error);
    mongoose.connection.close();
  }); 