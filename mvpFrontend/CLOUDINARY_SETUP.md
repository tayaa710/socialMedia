# Cloudinary Setup Guide

This application uses Cloudinary for image storage and optimization. Here's how to set it up:

## 1. Create a Cloudinary Account

If you haven't already, sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com/).

## 2. Get Your Cloud Name

After signing up, note your cloud name from the Cloudinary dashboard. This is already configured in the app with the cloud name `duotqd1pb`, but you can replace it with your own.

## 3. Create an Upload Preset

For security, we use an unsigned upload preset:

1. Go to Settings > Upload in your Cloudinary console
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set "Signing Mode" to "Unsigned"
5. Name your preset "social_media_app" (or update the name in the CloudinaryContext.jsx file)
6. Configure any other settings (like folder path, allowed formats, etc.)
7. Save the changes

## 4. CORS Configuration

Ensure CORS is properly configured:

1. Go to Settings > Security in your Cloudinary console
2. Add your website URL to the allowed CORS origins
3. Add `http://localhost:5173` for local development

## Usage in the Application

The Cloudinary context is now available throughout the app. Here's how to use it:

```jsx
// Import the hook
import { useCloudinary } from '../../context/CloudinaryContext';

// Within your component
const { uploadImage, getOptimizedImage, AdvancedImage } = useCloudinary();

// Upload an image
const imageUrl = await uploadImage(fileObject);

// Get an optimized image
const optimizedImage = getOptimizedImage('public_id', 500, 500);

// Render an optimized image
<AdvancedImage cldImg={optimizedImage} />
```

## Security Considerations

- The current implementation uses an unsigned upload preset, which is not as secure for production.
- For a production environment, consider implementing signed uploads using your backend.
- Set proper upload limits and restrictions in your Cloudinary settings. 