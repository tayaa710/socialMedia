require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');
const { processImageLocally } = require('./utils/blip');

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

// Process a single job from the queue
async function processJob() {
  // Find a queued job and update its status to processing
  const job = await ImageQueue.findOneAndUpdate(
    { status: 'queued' },
    { status: 'processing' },
    { new: true }
  );

  if (!job) {
    console.log('No jobs in queue');
    return;
  }

  console.log(`Processing job ${job._id} for image ${job.imageId}`);

  try {
    // Lookup the Post by its ID
    const post = await Post.findById(job.imageId);
    
    if (!post) {
      console.error(`Post not found: ${job.imageId}`);
      job.status = 'failed';
      await job.save();
      return;
    }

    // Process image to get caption and categories
    const imageResult = await processImageLocally(post.photo);
    const { caption, categories } = imageResult;
    
    // Update the post
    post.imageAnalysis = { caption, categories };
    post.caption = caption;
    post.categories = categories || [];
    post.processed = true;
    post.processingFailed = false;
    await post.save();

    // Mark job as done
    job.status = 'done';
    await job.save();
    
    console.log(`Successfully processed image ${post._id}:`);
    console.log(`Caption: "${caption}"`);
    console.log(`Categories: ${categories.join(', ')}`);
  } catch (error) {
    console.error(`Error processing job ${job._id}:`, error);
    
    // Mark job as failed
    job.status = 'failed';
    await job.save();
    
    // Mark post as failed
    try {
      const post = await Post.findById(job.imageId);
      if (post) {
        post.processingFailed = true;
        await post.save();
      }
    } catch (postError) {
      console.error(`Error updating post ${job.imageId}:`, postError);
    }
  }
}

// Main worker function
async function runWorker() {
  await connectDB();
  
  console.log('Image processing worker started');
  
  // Process a job every 10 seconds
  setInterval(processJob, 10000);
}

// Start the worker
runWorker().catch(error => {
  console.error('Worker error:', error);
  process.exit(1);
});