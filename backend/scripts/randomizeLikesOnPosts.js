const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    randomizeLikesOnPosts();
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

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

async function randomizeLikesOnPosts() {
  try {
    // Get all users and posts
    const users = await User.find({});
    const posts = await Post.find({});
    
    console.log(`Found ${users.length} users and ${posts.length} posts`);
    
    if (users.length === 0) {
      console.error('No users found in the database');
      mongoose.disconnect();
      return;
    }
    
    if (posts.length === 0) {
      console.error('No posts found in the database');
      mongoose.disconnect();
      return;
    }
    
    // Process each post
    for (const post of posts) {
      // Clear existing likes
      post.likes = [];
      
      // Randomly decide how many users will like this post (0 to all users)
      const maxLikes = Math.min(users.length, 15); // Cap at 15 likes max
      const numberOfLikes = Math.floor(Math.random() * maxLikes);
      
      // Create a copy of users array to randomly select from
      const availableUsers = [...users];
      
      // Randomly select users to like the post
      for (let i = 0; i < numberOfLikes; i++) {
        if (availableUsers.length === 0) break;
        
        // Pick a random user
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const randomUser = availableUsers[randomIndex];
        
        // Add the user ID to likes
        post.likes.push(randomUser._id);
        
        // Remove the user from available users so they don't like twice
        availableUsers.splice(randomIndex, 1);
      }
      
      // Save the updated post
      await post.save();
    }
    
    console.log(`Successfully randomized likes for ${posts.length} posts`);
    console.log('Process completed successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error randomizing likes:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 