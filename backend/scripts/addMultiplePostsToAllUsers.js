const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const POSTS_PER_USER = 10; // Adjust as needed
const TOTAL_POSTS = 100;   // Total posts to create

console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    addMultiplePostsToAllUsers();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define schemas for this script
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
  },
  {
    description: "Beautiful morning at the lake. The water is so calm and peaceful today. #nature #morning #lake",
    photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    description: "Visited the art museum today. This painting really caught my eye. #art #museum #culture",
    photo: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    description: "Just adopted this cute puppy from the shelter! Meet Max! 🐶 #adoption #puppy #newpet",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    description: "First day at my new job! Excited for this new chapter. #newbeginnings #career #work",
    photo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
  },
  {
    description: "Concert night with my best friends! The music was amazing. #concert #music #friends",
    photo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    description: "Trying out a new recipe for dinner tonight. Looks delicious! #cooking #foodie #homemade",
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    description: "Weekend getaway to the mountains. The perfect escape from the city. #travel #mountains #weekend",
    photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }
];

// Function to add a delay between operations to prevent overloading the database
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function addMultiplePostsToAllUsers() {
  try {
    // Get all users from the database
    const users = await User.find({});
    
    if (users.length === 0) {
      console.error('No users found in the database');
      mongoose.disconnect();
      return;
    }
    
    console.log(`Found ${users.length} users`);
    
    // Calculate how many posts to add per user to reach the target
    let postsToAddPerUser = Math.ceil(TOTAL_POSTS / users.length);
    
    // If we have too few users, cap the posts per user
    if (postsToAddPerUser > POSTS_PER_USER) {
      postsToAddPerUser = POSTS_PER_USER;
      console.log(`Capping posts per user to ${POSTS_PER_USER}`);
    }
    
    const totalPostsToAdd = postsToAddPerUser * users.length;
    console.log(`Will add approximately ${totalPostsToAdd} posts (${postsToAddPerUser} per user)`);
    
    let totalAdded = 0;
    
    // For each user, add the specified number of posts
    for (const user of users) {
      console.log(`Adding posts for user: ${user.username}`);
      
      const addedPosts = [];
      
      // Add posts with a small delay between each
      for (let i = 0; i < postsToAddPerUser; i++) {
        // Select a random post from our template array
        const randomIndex = Math.floor(Math.random() * randomPosts.length);
        const randomPost = randomPosts[randomIndex];
        
        // Create post with a timestamp in the past few days (for varied timeline)
        const daysAgo = Math.floor(Math.random() * 30); // Random day in the last month
        const hoursAgo = Math.floor(Math.random() * 24); // Random hour in that day
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        createdAt.setHours(createdAt.getHours() - hoursAgo);
        
        // Create and save the new post
        const newPost = new Post({
          user: user._id,
          description: randomPost.description,
          photo: randomPost.photo,
          likes: [],
          comment: 0,
          createdAt: createdAt,
          updatedAt: createdAt
        });
        
        const savedPost = await newPost.save();
        addedPosts.push(savedPost);
        
        // Add post to user's posts array
        user.posts.push(savedPost._id);
        
        // Wait a small amount to not overload the database
        await delay(100);
      }
      
      // Save the updated user
      await user.save();
      
      totalAdded += addedPosts.length;
      console.log(`Added ${addedPosts.length} posts to user ${user.username}`);
      
      // Wait a bit between users
      await delay(500);
    }
    
    console.log(`Process completed successfully. Added ${totalAdded} posts to ${users.length} users.`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding posts:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 