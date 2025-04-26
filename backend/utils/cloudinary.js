const cloudinary = require('cloudinary').v2;
const config = require('./config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

/**
 * Upload an image to Cloudinary
 * @param {Buffer} imageBuffer - The image buffer to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
const uploadImage = async (imageBuffer) => {
  try {
    // Convert buffer to base64 string for Cloudinary upload
    const b64 = Buffer.from(imageBuffer).toString('base64');
    const dataURI = `data:image/jpeg;base64,${b64}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'social_media_app',
      resource_type: 'image'
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

module.exports = {
  uploadImage
}; 