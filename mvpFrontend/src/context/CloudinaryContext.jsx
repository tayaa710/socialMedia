import { createContext, useContext } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Create context
const CloudinaryContext = createContext();

// Create a hook to use the context
export const useCloudinary = () => useContext(CloudinaryContext);

export const CloudinaryProvider = ({ children }) => {
  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: { 
      cloudName: 'duotqd1pb' 
    }
  });

  // Function to upload an image to Cloudinary
  const uploadImage = async (file) => {
    if (!file) return null;
    
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'social_media_app'); // Create an unsigned upload preset in your Cloudinary dashboard
    
    try {
      // Upload the image
      const response = await fetch(`https://api.cloudinary.com/v1_1/duotqd1pb/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Function to get an optimized image URL
  const getOptimizedImage = (publicId, width = 500, height = 500) => {
    if (!publicId) return null;
    
    return cld
      .image(publicId)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(width).height(height));
  };

  // Values to provide through the context
  const contextValue = {
    cld,
    uploadImage,
    getOptimizedImage,
    AdvancedImage,
  };

  return (
    <CloudinaryContext.Provider value={contextValue}>
      {children}
    </CloudinaryContext.Provider>
  );
};

export default CloudinaryContext; 