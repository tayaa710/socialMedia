import { useState, useContext, useRef, useEffect } from 'react'
import './postCreate.css'
import { AuthContext } from '../../context/AuthContext'
import { postAPI } from '../../services/api'
import ImagePreview from './ImagePreview'
import ValidationError from './ValidationError'
import PostActions from './PostActions'

const PostCreate = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext)

  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  const description = useRef('')
  const fileInputRef = useRef(null)

  // Listen for image analysis status events
  useEffect(() => {
    const handleAnalysisStatus = (event) => {
      setIsAnalyzing(event.detail.isAnalyzing);
    };
    
    window.addEventListener('imageAnalysisStatus', handleAnalysisStatus);
    
    return () => {
      window.removeEventListener('imageAnalysisStatus', handleAnalysisStatus);
    };
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Clear previous errors when selecting a new file
      setError(null);
      setValidationErrors([]);

      setFile(selectedFile);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.current.value && !file) {
      return; // Don't submit empty posts
    }

    // Clear previous errors
    setError(null);
    setValidationErrors([]);
    
    setIsUploading(true);
    
    try {
      // Create FormData to send the file and post details
      const formData = new FormData();
      formData.append('description', description.current.value);
      
      if (file) {
        formData.append('image', file);
      }
      
      // Send post data with image to server
      const postData = await postAPI.createPost(formData);
      
      console.log('Post created:', postData);
      
      // Reset form
      description.current.value = '';
      setFile(null);
      setPreviewUrl(null);
      
      // Reset the file input element value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component that a post was created
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Handle validation errors
      if (error.response && error.response.data) {
        const { error: errorMessage, reasons } = error.response.data;
        setError(errorMessage || 'Failed to create post');
        setValidationErrors(reasons || []);
      } else {
        setError('Failed to create post. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setValidationErrors([]);
    description.current.value = '';
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDismissError = () => {
    setError(null);
    setValidationErrors([]);
  };

  return (
    <div className="postCreateContainer">
      <div className="postCreateHeader">
        <h3>Share Something {user.firstName}!</h3>
      </div>
      <form onSubmit={handleSubmit} className="postCreateForm">
        <textarea
          className="postCreateInput"
          placeholder="What's on your mind?"
          name="postText"
          ref={description}
          id="postText"
        />
        
        {previewUrl && (
          <ImagePreview 
            previewUrl={previewUrl} 
            isAnalyzing={isAnalyzing} 
            onRemove={handleImageRemove} 
          />
        )}

        {/* Display validation errors */}
        {error && (
          <ValidationError 
            error={error} 
            validationErrors={validationErrors} 
            onDismiss={handleDismissError} 
            onReset={resetForm} 
          />
        )}
        
        <PostActions 
          onFileChange={handleFileChange}
          isUploading={isUploading}
          isAnalyzing={isAnalyzing}
          fileInputRef={fileInputRef}
        />
      </form>
    </div>
  )
}

export default PostCreate 