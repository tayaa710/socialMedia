import { useState, useContext, useRef } from 'react'
import { AddPhotoAlternate, Mood, EmojiObjects, Send } from '@mui/icons-material'
import './postCreate.css'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const PostCreate = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext)

  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const description = useRef('')

  const token = localStorage.getItem("auth-token");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
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
    
    setIsUploading(true);
    
    try {
      // Create FormData to send the file and post details
      const formData = new FormData();
      formData.append('description', description.current.value);
      
      if (file) {
        formData.append('image', file);
      }
      
      // Send post data with image to server
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Post created:', response.data);
      
      // Reset form
      description.current.value = '';
      setFile(null);
      setPreviewUrl(null);
      
      // Notify parent component that a post was created
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
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
          <div className="imagePreviewContainer">
            <img src={previewUrl} alt="Preview" className="imagePreview" />
            <button 
              type="button" 
              className="removeImageBtn"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="postCreateActions">
          <div className="postCreateButtons">
            <label htmlFor="file" className="postCreateButton">
              <AddPhotoAlternate />
              <span>Photo</span>
            </label>
            <input
              type="file"
              id="file"
              accept=".png,.jpeg,.jpg"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button type="button" className="postCreateButton">
              <Mood />
              <span>Feeling</span>
            </button>
            <button type="button" className="postCreateButton">
              <EmojiObjects />
              <span>Idea</span>
            </button>
          </div>
          <button
            type="submit"
            className="postCreateSubmit"
            disabled={isUploading}
          >
            <Send />
            <span>{isUploading ? 'Posting...' : 'Share'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostCreate 