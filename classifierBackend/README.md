# Image Classification Backend

A standalone Node.js service that processes social media images asynchronously with the BLIP image captioning model.

## Features

- MongoDB + Mongoose for database operations
- Queue-based image processing
- BLIP image captioning model integration 
- Asynchronous processing with status tracking
- REST API for queue management

## Setup

1. Install Node.js dependencies:

```bash
npm install
```

2. Install Python dependencies:

```bash
pip install transformers pillow requests torch torchvision
```

3. Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/yourDatabase
PORT=4000  # API server port
```

## Usage

### Start the Queue Worker

```bash
npm start
```

### Start the API Server

```bash
npm run server
```

For development (with auto-restart):

```bash
npm run dev           # Queue worker with nodemon
npm run dev:server    # API server with nodemon
```

## How it works

1. Posts are created in the main backend application 
2. Post IDs are sent to this classifier backend via the local API
3. The classifier API adds the post ID to the ImageQueue collection with status "queued"
4. The queueWorker service processes images every 10 seconds
5. Once processed, captions are saved to the original post

## API Endpoints

### Add Post to Queue
- **POST /api/queue**
- Body: `{ "postId": "postIdString" }`
- Response: `{ "message": "Added to classification queue", "queueId": "queueItemId" }`

### Get Queue Status
- **GET /api/queue/status**
- Response: `{ "queued": 5, "processing": 1, "done": 10, "failed": 2 }`

## Integration with Main Backend

The main backend application communicates with this service via the local API endpoint.

In the main backend, when a post is created, a request is sent to add it to the classification queue:

```javascript
// After saving a post
const postId = savedPost._id.toString();
await axios.post('http://localhost:4000/api/queue', { postId });
```

## Testing with Existing Posts

Several utility scripts are provided to help test the service:

### Add Posts to Queue

```bash
node test-queue-add.js
```
Finds all unprocessed posts with photos and adds them to the queue.

### Check Queue Status

```bash
node test-queue-status.js
```
Shows the current queue statistics and lists recently processed posts.

### Test Single Image

```bash
node test-single-image.js
```
Tests the BLIP captioning on a single image URL (edit the file to set the URL).

### Reset Queue Items

```bash
node test-reset-queue.js failed  # Reset all failed jobs
node test-reset-queue.js stuck   # Reset jobs stuck in 'processing' state
```

## Data Models

### Post
- User information
- Description
- Photo URL
- Generated caption
- Processing status

### ImageQueue
- References a Post's ID
- Tracks processing status (queued, processing, done, failed) 