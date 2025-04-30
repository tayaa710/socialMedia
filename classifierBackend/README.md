# Image Classification Backend

A standalone Node.js service that processes Authentra images asynchronously with the BLIP image captioning model.

## Features

- MongoDB + Mongoose for database operations
- Queue-based image processing
- BLIP image captioning model integration 
- Asynchronous processing with retry logic and status tracking
- RESTful API for queue management
- Improved error handling and model loading

## Setup

1. Install Node.js dependencies:

```bash
npm install
```

2. Install Python dependencies:

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install transformers pillow requests torch torchvision tqdm
```

3. Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/yourDatabase
PORT=4000  # API server port
```

## Starting the Services

Start both services:

```bash
# Terminal 1 - Start the API server
npm run server

# Terminal 2 - Start the queue worker
npm start
```

The first time you run the worker, the BLIP model will be downloaded and loaded, which can take several minutes. The system is designed to handle this gracefully - any image processing requests will be queued and processed once the model is fully loaded.

## How it works

1. Posts are created in the main backend application
2. Post IDs are sent to this classifier backend via the API (`/api/queue`)
3. The queue worker processes images in order using the BLIP model
4. The worker includes retry logic for temporary failures
5. Once processed, captions and categories are saved to the original post

## Troubleshooting

If images are not being processed correctly, check the following:

1. **Queue Worker Logs**: Look for errors in the queue worker logs 
2. **Model Loading**: Check if the BLIP model loaded correctly
3. **Retry Status**: Check if jobs are being retried due to model loading issues
4. **MongoDB Connection**: Ensure your MongoDB connection is working 
5. **Image URLs**: Verify that image URLs are publicly accessible

## Debugging

You can check the current queue status:

```bash
# Get current queue status via API
curl http://localhost:4000/api/queue/status

# Using npm script to get queue status
npm run queue status

# Reset failed jobs
npm run queue failed

# Reset stuck processing jobs
npm run queue stuck

# Reset all failed and stuck jobs
npm run queue all
```

## Testing with CLI

You can also test the BLIP model directly:

```bash
# From classifierBackend directory
source venv/bin/activate  # On Windows: venv\Scripts\activate
python classify.py https://example.com/path/to/image.jpg
```

This will output the caption and categories for the specified image.

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