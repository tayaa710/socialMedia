require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/post');
const ImageQueue = require('./models/ImageQueue');

const app = express();
const PORT = process.env.PORT || 4000;

// Determine the client URL based on environment
const clientUrl = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL || 'https://authentra-frontend.onrender.com'
  : "http://localhost:5173";

console.log("Client URL for CORS:", clientUrl);

// Middleware
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.post('/api/queue', async (req, res) => {
  try {
    const { postId } = req.body;
    
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Validate that the postId exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already in queue
    const existing = await ImageQueue.findOne({ imageId: post.id });
    if (existing) {
      return res.status(200).json({ 
        message: 'Post already in queue', 
        status: existing.status,
        queueId: existing.id
      });
    }

    // Add to queue
    const queueItem = new ImageQueue({
      imageId: post.id,
      status: 'queued'
    });
    
    await queueItem.save();
    
    res.status(201).json({ 
      message: 'Added to classification queue',
      queueId: queueItem.id
    });
  } catch (error) {
    console.error('Queue error:', error);
    res.status(500).json({ error: 'Server error adding to queue' });
  }
});

// Queue status endpoint
app.get('/api/queue/status', async (req, res) => {
  try {
    const stats = {
      queued: await ImageQueue.countDocuments({ status: 'queued' }),
      processing: await ImageQueue.countDocuments({ status: 'processing' }),
      done: await ImageQueue.countDocuments({ status: 'done' }),
      failed: await ImageQueue.countDocuments({ status: 'failed' }),
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Queue status error:', error);
    res.status(500).json({ error: 'Server error getting queue status' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Classifier API server running on port ${PORT}`);
}); 