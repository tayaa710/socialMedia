# Cloudinary Backend Setup Guide

This application now handles image uploads directly through the backend rather than the frontend. Here's what you need to know:

## Backend Setup

1. **Environment Variables**

   Create a `.env` file in the `backend` folder with the following variables:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Note: The default cloud name is set to `duotqd1pb` if none is provided.

2. **Cloudinary Account Setup**

   If you don't have these values:
   - Sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret from the dashboard
   - Create a folder named `social_media_app` in your Cloudinary media library (optional)

## How It Works

1. **Frontend:** 
   - User selects an image in the post creation form
   - The form submits the image as a FormData object to the API

2. **Backend:**
   - Receives the image using multer's memory storage
   - Uploads the image to Cloudinary
   - Saves the post with the Cloudinary image URL
   - Returns the post data to the frontend

## Security Benefits

- API keys and secrets are now only stored on the server, not exposed to the client
- Server-side validation of uploads
- File size and type restrictions
- More controlled upload process

## Changes

- Removed CloudinaryProvider from the frontend
- Added multer for handling multipart/form-data uploads
- Created a Cloudinary utility for the backend
- Updated posts controller to handle file uploads

## Troubleshooting

If you encounter issues:
1. Check that your Cloudinary credentials are correctly set in the `.env` file
2. Ensure the backend server is running
3. Look for errors in the backend console
4. Verify that image uploads don't exceed the 5MB limit 