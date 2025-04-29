require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');
const { processImageLocally, waitForModelReady } = require('./utils/blip');

// Worker configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 60000; // 1 minute
const PROCESS_INTERVAL = 10000; // 10 seconds
const STARTUP_DELAY = 5000; // 5 seconds

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
    { 
      $or: [
        { status: 'queued' },
        // Also find jobs that were processing but got stuck (more than 30 minutes ago)
        { 
          status: 'processing', 
          updatedAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } 
        }
      ]
    },
    { 
      status: 'processing',
      retries: { $inc: 1 }
    },
    { new: true }
  );

  if (!job) {
    console.log('No jobs in queue');
    return;
  }

  console.log(`Processing job ${job._id} for image ${job.imageId} (attempt ${job.retries || 1})`);

  try {
    // Lookup the Post by its ID
    const post = await Post.findById(job.imageId);
    
    if (!post) {
      console.error(`Post not found: ${job.imageId}`);
      job.status = 'failed';
      job.error = 'Post not found';
      await job.save();
      return;
    }

    // Process image to get caption and categories
    // Set waitForModel to true for first attempt, false for retries
    const shouldWait = (job.retries || 1) <= 1;
    console.log(`Processing with waitForModel=${shouldWait}`);
    
    const imageResult = await processImageLocally(post.photo, shouldWait);
    
    // Check if we got an error about the model not being ready
    if (imageResult.error && 
        (imageResult.error.includes('Model is not loaded yet') || 
         imageResult.error.includes('Model is still loading'))) {
      
      // If we've already tried several times, mark as failed temporarily
      if ((job.retries || 1) >= MAX_RETRIES) {
        console.log(`Job ${job._id} has reached max retries, marking as failed`);
        job.status = 'failed';
        job.error = imageResult.error;
        await job.save();
      } else {
        // Otherwise, put it back in the queue
        console.log(`Model not ready, putting job ${job._id} back in queue`);
        job.status = 'queued';
        await job.save();
      }
      return;
    }
    
    // Process actual results
    const { caption, categories, error } = imageResult;
    
    if (error) {
      console.error(`Error processing image: ${error}`);
      
      // If we've tried too many times, mark as failed
      if ((job.retries || 1) >= MAX_RETRIES) {
        job.status = 'failed';
        job.error = error;
        await job.save();
        
        post.processingFailed = true;
        await post.save();
      } else {
        // Otherwise put it back in the queue
        job.status = 'queued';
        await job.save();
      }
      return;
    }
    
    // Update the post with caption and categories
    post.imageAnalysis = { caption, categories };
    post.caption = caption;
    post.categories = categories || [];
    post.processed = true;
    post.processingFailed = false;
    await post.save();

    // Mark job as done
    job.status = 'done';
    job.processedAt = new Date();
    await job.save();
    
    console.log(`Successfully processed image ${post._id}:`);
    console.log(`Caption: "${caption}"`);
    console.log(`Categories: ${categories ? categories.join(', ') : 'none'}`);
  } catch (error) {
    console.error(`Error processing job ${job._id}:`, error);
    
    // Check if we should retry
    if ((job.retries || 1) < MAX_RETRIES) {
      console.log(`Will retry job ${job._id} later`);
      job.status = 'queued';
      await job.save();
    } else {
      // Mark job as failed
      job.status = 'failed';
      job.error = error.message;
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
}

// Reset failed jobs
async function resetFailedJobs() {
  const result = await ImageQueue.updateMany(
    { status: 'failed' },
    { 
      status: 'queued',
      $unset: { error: "" }
    }
  );
  
  if (result.modifiedCount > 0) {
    console.log(`Reset ${result.modifiedCount} failed jobs to 'queued'`);
  }
}

// Main worker function
async function runWorker() {
  await connectDB();
  
  console.log('Image processing worker started');
  
  // Wait to make sure the model loading has started
  console.log('Waiting for startup delay...');
  await new Promise(resolve => setTimeout(resolve, STARTUP_DELAY));
  
  // Try to wait for model to be ready at startup
  try {
    console.log('Checking if model is ready...');
    await waitForModelReady();
    console.log('Model is ready, starting to process queue');
  } catch (error) {
    console.log(`Could not confirm model readiness: ${error.message}`);
    console.log('Will start processing queue anyway');
  }
  
  // Set an interval to reset failed jobs every hour
  setInterval(resetFailedJobs, 60 * 60 * 1000);
  
  // Process a job every 10 seconds
  setInterval(processJob, PROCESS_INTERVAL);
}

// Start the worker
runWorker().catch(error => {
  console.error('Worker error:', error);
  process.exit(1);
});