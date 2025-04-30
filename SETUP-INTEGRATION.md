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

```

### 2. Install Dependencies

**For Main Backend:**
```bash
cd backend
npm install
```

**For Classifier Backend:** **Create a virtual environment before installing called venv**
```bash
cd classifierBackend
npm install
# Also install Python dependencies
pip install transformers pillow requests torch torchvision
```

### 3. Start the Services

**Start the Classifier Backend:** **This is the server that recieves posts and puts them into the queue for classification**

In one terminal:
```bash
cd classifierBackend
# Start the API server on port 4000
npm run server
```
**This is the server that takes posts from the queue one by one and sends them to the model for classification and then updates the posts**
In another terminal:
```bash
cd classifierBackend
# Start the queue worker
npm start
```

**Start classifier model in python**
```bash
cd classifierBackend
#Start the model
source venv/bin/activate
python classifier.py
```

**Start the Main Backend:** **The backend for everything else so far**
```bash
cd backend
npm run dev
```

**Start the Main Frontend:**
```bash
cd mvpFrontend
npm run dev
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