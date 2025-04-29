# Setting Up Post Classification Integration

This document explains how to set up the integration between the main backend and the classifier backend.

## Overview

The integration flow works as follows:

1. User creates a post in the main application
2. The post is saved to MongoDB with image stored in Cloudinary
3. The main backend sends the post ID to the classifier backend's local API
4. The classifier backend adds the post ID to its queue
5. The classifier worker processes the queue and adds captions to posts

## Setup Instructions

### 1. Configure Environment Variables

**For Classifier Backend:**

Add to your `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/yourDatabase
PORT=4000
```

### 2. Install Dependencies

**For Main Backend:**
```bash
cd backend
npm install
```

**For Classifier Backend:**
```bash
cd classifierBackend
npm install
# Also install Python dependencies
pip install transformers pillow requests torch torchvision
```

### 3. Start the Services

**Start the Classifier Backend:**

In one terminal:
```bash
cd classifierBackend
# Start the API server
npm run server
```

In another terminal:
```bash
cd classifierBackend
# Start the queue worker
npm start
```

**Start the Main Backend:**
```bash
cd backend
npm start
```

## Testing the Integration

1. Create a post with an image through the frontend
2. Check the console logs in the main backend to see if the post was successfully sent to the classifier
3. Check the classifier backend logs to see if the post was added to the queue
4. After processing (which happens every 10 seconds), the post should have a caption field added in the MongoDB

## Troubleshooting

- If posts are not being sent to the classifier, check the main backend logs for errors
- If the classifier API is not responding, make sure the server is running on port 4000
- If posts are in the queue but not being processed, check the classifier worker logs
- If the processing fails, check the Python environment and BLIP model setup 