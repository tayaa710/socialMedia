const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const TARGET_USERNAME = 'aarontaylor24';

console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    addRandomPostsToUser();
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

// Random post content
const randomPosts = [
  {
    description: "Just hiked to the top of Mount Rainier! The view is absolutely breathtaking. #hiking #nature #adventure",
    photo: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    description: "Trying out this new coffee shop downtown. Their latte art is on point! ☕ #coffeelover #citylife",
    photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    description: "Sunset beach vibes with friends. Perfect end to a perfect day. 🌅 #sunset #beachlife #friends",
    photo: "https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
  },
  {
    description: "Just finished this book and I'm still processing all the feelings. Highly recommend! 📚 #bookrecommendation #reading",
    photo: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    description: "Made homemade pasta for the first time today! Not bad for a beginner, right? 🍝 #cooking #homemade #foodie",
    photo: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }
];

async function addRandomPostsToUser() {
  try {
    // Find the user by username
    const user = await User.findOne({ username: TARGET_USERNAME });
    
    if (!user) {
      console.error(`User ${TARGET_USERNAME} not found`);
      mongoose.disconnect();
      return;
    }
    
    console.log(`Found user ${TARGET_USERNAME} with ID: ${user._id}`);
    
    // Add 3 random posts
    const numberOfPostsToAdd = 3;
    const addedPosts = [];
    
    for (let i = 0; i < numberOfPostsToAdd; i++) {
      // Select a random post from our template array
      const randomIndex = Math.floor(Math.random() * randomPosts.length);
      const randomPost = randomPosts[randomIndex];
      
      // Create and save the new post
      const newPost = new Post({
        user: user._id,
        description: randomPost.description,
        photo: randomPost.photo,
        likes: [],
        comment: 0
      });
      
      const savedPost = await newPost.save();
      addedPosts.push(savedPost);
      
      // Add post to user's posts array
      user.posts.push(savedPost._id);
    }
    
    // Save the updated user
    await user.save();
    
    console.log(`Successfully added ${addedPosts.length} posts to user ${TARGET_USERNAME}`);
    addedPosts.forEach((post, index) => {
      console.log(`Post ${index + 1}: ${post._id} - ${post.description.substring(0, 30)}...`);
    });
    
    console.log('Process completed successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding posts:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 