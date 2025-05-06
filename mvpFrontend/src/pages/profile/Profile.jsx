import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfilePosts from '../../components/profilePosts/ProfilePosts'
import SelectionBar from '../../components/selectionBar/SelectionBar'
import Topbar from '../../components/topbar/Topbar'
import Userbar from '../../components/userbar/Userbar'
import ProfileFriends from '../../components/profileFriends/ProfileFriends'
import ImageCropper from '../../components/imageCropper/ImageCropper'
import { createCroppedImage } from '../../utils/cropImage'
import './profile.css'
import { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router'
import { userAPI } from '../../services/api'
import { AuthContext } from '../../context/AuthContext'
import ValidationError from '../../components/postCreate/ValidationError'

const Profile = () => {
  const id = useParams().id
  const [selectedOption, setSelectedOption] = useState("Posts")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const fileInputRef = useRef(null)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)

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
      
      // Create a URL for the image to display in the cropper
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageToCrop(imageUrl);
      
      // Show the cropper
      setShowCropper(true);
    }
  };
  
  // Handle crop complete and prepare to upload
  const handleCropComplete = async (croppedAreaPixels) => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        // Create a cropped image file
        const croppedImage = await createCroppedImage(imageToCrop, croppedAreaPixels);
        
        // Upload the cropped image
        if (croppedImage) {
          handleProfilePictureUpload(croppedImage);
        }
      } catch (error) {
        console.error('Error creating cropped image:', error);
        setError('Failed to crop image. Please try again.');
      }
    }
  };
  
  // Handle cropper close without saving
  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle cropper save (close the cropper - actual upload happens in handleCropComplete)
  const handleCropSave = () => {
    setShowCropper(false);
    
    // Clean up the object URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
    }
  };
  
  // Upload profile picture
  const handleProfilePictureUpload = async (file) => {
    if (!file) return;
    
    setError(null);
    setValidationErrors([]);
    
    try {
      // Upload profile picture
      const updatedUser = await userAPI.updateProfilePicture(currentUser.id, file);
      
      // Update user in state
      setUser(updatedUser);
      
      // Update user in context
      dispatch({ 
        type: "UPDATE_USER", 
        payload: updatedUser
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      
      // Handle validation errors
      if (error.response && error.response.data) {
        const { error: errorMessage, reasons } = error.response.data;
        setError(errorMessage || 'Failed to update profile picture');
        setValidationErrors(reasons || []);
      } else {
        setError('Failed to update profile picture. Please try again.');
      }
    }
  };
  
  // Handle click on profile picture when viewing own profile
  const handleProfilePictureClick = () => {
    if (currentUser && user && currentUser.id === user.id) {
      // Trigger file input click
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };
  
  // Handle dismiss error
  const handleDismissError = () => {
    setError(null);
    setValidationErrors([]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await userAPI.getUser(id);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
  // Show nothing while loading
  if (isLoading) {
    return null;
  }
  
  // If user not found, show an error message
  if (!user && !isLoading) {
    return (
      <div className='pageContainer'>
        <Topbar />
        <div className="errorContainer" style={{ 
          textAlign: 'center', 
          margin: '100px auto', 
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          maxWidth: '600px'
        }}>
          <h2>User Not Found</h2>
          <p>Sorry, the user profile you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
  
  const renderOption = () => {
    switch (selectedOption) {
      case "Posts": return <ProfilePosts user={user} />
      case "Friends": return <ProfileFriends user={user} />
      case "Info": return <ProfileInfo user={user} />
      default: return <ProfilePosts user={user} />
    }
  }

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  return (
    <div className='pageContainer'>
      <div className="heading">
        <Topbar />
        <Userbar 
          profileUser={user} 
          onProfilePictureClick={handleProfilePictureClick}
          isOwnProfile={isOwnProfile}
        />
        <SelectionBar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </div>
      
      <div className="profileBody">
        {renderOption()}
      </div>
      
      {/* Hidden file input for profile picture upload */}
      <input
        type="file"
        id="profile-picture-input"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      {/* Display validation errors */}
      {error && (
        <div className="profileErrorContainer">
          <ValidationError 
            error={error} 
            validationErrors={validationErrors} 
            onDismiss={handleDismissError} 
            onReset={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }} 
          />
        </div>
      )}
      
      {/* Image Cropper */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
      )}
      
      {/* Analysis status message */}
      {isAnalyzing && (
        <div className="analysisStatusContainer">
          <div className="analysisStatus">
            <div className="analysisSpinner"></div>
            <p>Analyzing image...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
