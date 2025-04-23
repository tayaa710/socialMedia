const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const USER_ID = '68086427158d42e49dbe2f43';

console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    addLikesToPosts();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function addLikesToPosts() {
  try {
    const db = mongoose.connection;
    const postsCollection = db.collection('posts');
    
    // Find all posts
    const posts = await postsCollection.find({}).toArray();
    console.log(`Found ${posts.length} posts to update`);
    
    // Update each post to add the user ID to the likes array
    let successCount = 0;
    for (const post of posts) {
      await postsCollection.updateOne(
        { _id: post._id },
        { 
          $addToSet: { likes: mongoose.Types.ObjectId.createFromHexString(USER_ID) }
        }
      );
      successCount++;
    }
    
    console.log(`Successfully updated ${successCount} posts`);
    console.log('Update completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during update:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 