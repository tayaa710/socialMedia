# Image Classification Backend

A standalone Node.js service that processes social media images asynchronously with the BLIP image captioning model.

## Features

- MongoDB + Mongoose for database operations
- Queue-based image processing
- BLIP image captioning model integration 
- Asynchronous processing with status tracking

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
```

## Usage

Start the service:

```bash
npm start
```

For development (with auto-restart):

```bash
npm run dev
```

## How it works

1. Add new posts to the database
2. Add image IDs to the ImageQueue collection with status "queued"
3. The queueWorker service processes images every 10 seconds
4. Once processed, captions are saved to the original post

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