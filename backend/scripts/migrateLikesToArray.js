const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    migrateData();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function migrateData() {
  try {
    const db = mongoose.connection;
    const postsCollection = db.collection('posts');
    
    // Find all posts with the old 'like' field
    const posts = await postsCollection.find({ like: { $exists: true } }).toArray();
    console.log(`Found ${posts.length} posts to migrate`);
    
    // Update each post
    let successCount = 0;
    for (const post of posts) {
      await postsCollection.updateOne(
        { _id: post._id },
        { 
          $set: { likes: [] },  // Set likes to empty array
          $unset: { like: "" }  // Remove the old like field
        }
      );
      successCount++;
    }
    
    console.log(`Successfully migrated ${successCount} posts`);
    console.log('Migration completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 