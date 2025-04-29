require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');
const { processImageLocally, waitForModelReady } = require('./utils/blip');

// Main function
async function runFullProcess() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 1. Reset all posts (optional)
    const shouldReset = process.argv.includes('--reset');
    if (shouldReset) {
      console.log('\n=== STEP 1: Resetting all posts ===');
      await resetAllPosts();
    }
    
    // 2. Clear the queue (optional)
    const shouldClearQueue = process.argv.includes('--clear-queue');
    if (shouldClearQueue) {
      console.log('\n=== STEP 2: Clearing the queue ===');
      const result = await ImageQueue.deleteMany({});
      console.log(`Deleted ${result.deletedCount} items from the queue`);
    }
    
    // 3. Wait for model to be ready
    console.log('\n=== STEP 3: Checking if model is ready ===');
    try {
      await waitForModelReady();
      console.log('Model is ready to process images');
    } catch (error) {
      console.error('WARNING: Model is not ready:', error.message);
      if (!process.argv.includes('--ignore-model-error')) {
        console.error('Exiting. Use --ignore-model-error to continue anyway');
        process.exit(1);
      }
    }
    
    // 4. Add posts to queue
    console.log('\n=== STEP 4: Adding posts to queue ===');
    // Find all posts that need processing
    const query = { 
      photo: { $exists: true, $ne: null },
      $or: [
        { processed: false },
        { processingFailed: true },
        { caption: null }
      ]
    };
    
    const posts = await Post.find(query);
    console.log(`Found ${posts.length} posts that need processing`);
    
    // Add to queue
    let addedCount = 0;
    for (const post of posts) {
      // Check if already in queue
      const existing = await ImageQueue.findOne({ imageId: post._id });
      if (!existing) {
        const queueItem = new ImageQueue({
          imageId: post._id,
          status: 'queued',
          retries: 0
        });
        await queueItem.save();
        addedCount++;
      }
    }
    console.log(`Added ${addedCount} posts to the queue`);
    
    // 5. Process a batch of posts
    const shouldProcess = process.argv.includes('--process');
    if (shouldProcess) {
      console.log('\n=== STEP 5: Processing images ===');
      const batchSize = parseInt(process.argv.find(arg => arg.startsWith('--batch='))?.split('=')[1] || '10');
      console.log(`Processing ${batchSize} images...`);
      
      let processed = 0;
      let successes = 0;
      let failures = 0;
      
      while (processed < batchSize) {
        // Get next job from queue
        const job = await ImageQueue.findOneAndUpdate(
          { status: 'queued' },
          { status: 'processing' },
          { new: true }
        );
        
        if (!job) {
          console.log('No more jobs in queue');
          break;
        }
        
        console.log(`Processing job ${job._id} for post ${job.imageId}`);
        
        try {
          // Get the post
          const post = await Post.findById(job.imageId);
          if (!post) {
            console.error(`Post not found: ${job.imageId}`);
            job.status = 'failed';
            job.error = 'Post not found';
            await job.save();
            failures++;
            continue;
          }
          
          // Process the image
          const result = await processImageLocally(post.photo, true);
          
          if (result.error) {
            console.error(`Error processing image: ${result.error}`);
            job.status = 'failed';
            job.error = result.error;
            await job.save();
            failures++;
          } else {
            // Update post
            post.caption = result.caption;
            post.categories = result.categories || [];
            post.imageAnalysis = { caption: result.caption, categories: result.categories };
            post.processed = true;
            post.processingFailed = false;
            await post.save();
            
            // Update job
            job.status = 'done';
            job.processedAt = new Date();
            await job.save();
            successes++;
            
            console.log(`Successfully processed image for post ${post._id}`);
            console.log(`Caption: ${result.caption.substring(0, 100)}...`);
          }
        } catch (error) {
          console.error(`Error processing job: ${error.message}`);
          job.status = 'failed';
          job.error = error.message;
          await job.save();
          failures++;
        }
        
        processed++;
      }
      
      // Print summary
      console.log('\nProcessing Summary:');
      console.log(`- Total processed: ${processed}`);
      console.log(`- Successful: ${successes}`);
      console.log(`- Failed: ${failures}`);
    }
    
    // 6. Show final queue status
    console.log('\n=== Final Queue Status ===');
    const queueStats = {
      queued: await ImageQueue.countDocuments({ status: 'queued' }),
      processing: await ImageQueue.countDocuments({ status: 'processing' }),
      done: await ImageQueue.countDocuments({ status: 'done' }),
      failed: await ImageQueue.countDocuments({ status: 'failed' }),
    };
    console.log(queueStats);
    
  } catch (error) {
    console.error('Error in process:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Helper function to reset all posts
async function resetAllPosts() {
  const posts = await Post.find({
    photo: { $exists: true, $ne: null }
  });
  
  console.log(`Found ${posts.length} posts with photos to reset`);
  
  let updatedCount = 0;
  for (const post of posts) {
    post.caption = null;
    post.categories = [];
    post.imageAnalysis = null;
    post.processed = false;
    post.processingFailed = false;
    
    await post.save();
    updatedCount++;
    
    if (updatedCount % 10 === 0) {
      console.log(`Reset ${updatedCount}/${posts.length} posts...`);
    }
  }
  
  console.log(`Reset ${updatedCount} posts to unprocessed state`);
}

// Print usage information
function printUsage() {
  console.log('Usage: node run-full-process.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --reset              Reset all posts (clear captions, categories, etc.)');
  console.log('  --clear-queue        Remove all existing items from the queue');
  console.log('  --process            Process a batch of images');
  console.log('  --batch=N            Process N images (default: 10)');
  console.log('  --ignore-model-error Continue even if model is not ready');
  console.log('');
  console.log('Examples:');
  console.log('  node run-full-process.js --reset --clear-queue --process');
  console.log('  node run-full-process.js --process --batch=20');
}

// Check if help was requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage();
} else {
  // Run the full process
  runFullProcess();
} 