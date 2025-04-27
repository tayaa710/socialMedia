const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    deletePostsWithoutPhoto();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define schemas just for this script
const userSchema = new mongoose.Schema({
  username: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      max: 500
    },
    photo: {
      type: String
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    comment: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

async function deletePostsWithoutPhoto() {
  try {
    console.log('Searching for posts without photos...');
    
    // Find all posts where photo is undefined, null, empty string or doesn't exist
    const query = {
      $or: [
        { photo: { $exists: false } },
        { photo: null },
        { photo: '' }
      ]
    };
    
    // First get the posts to be deleted to gather info for reporting and user post cleanup
    const postsToDelete = await Post.find(query);
    
    if (postsToDelete.length === 0) {
      console.log('No posts without photos found.');
      mongoose.disconnect();
      return;
    }
    
    console.log(`Found ${postsToDelete.length} posts without photos to delete.`);
    
    // Get all unique user IDs from the posts
    const userIds = [...new Set(postsToDelete.map(post => post.user.toString()))];
    console.log(`These posts belong to ${userIds.length} different users.`);
    
    // Get post IDs for deletion from user post arrays
    const postIds = postsToDelete.map(post => post._id);
    
    // Update all affected users by removing the posts from their posts arrays
    const updateUsersResult = await User.updateMany(
      { posts: { $in: postIds } },
      { $pull: { posts: { $in: postIds } } }
    );
    
    console.log(`Updated ${updateUsersResult.modifiedCount} users' post arrays.`);
    
    // Delete the posts
    const deleteResult = await Post.deleteMany(query);
    
    console.log(`Successfully deleted ${deleteResult.deletedCount} posts without photos.`);
    
    // Display sample of the deleted posts for verification
    console.log('\nSample of deleted posts:');
    postsToDelete.slice(0, 5).forEach((post, index) => {
      console.log(`${index + 1}. Post ID: ${post._id}, User ID: ${post.user}, Description: ${post.description ? post.description.substring(0, 30) + '...' : 'No description'}`);
    });
    
    console.log('\nProcess completed successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error deleting posts:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 