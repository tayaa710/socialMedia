/* eslint-disable react/prop-types */
import './post.css'
import { useState, useEffect } from 'react'
import { Favorite, Share, Comment, LocalFlorist, HelpOutline, InfoOutlined, Person } from '@mui/icons-material'
import axios from 'axios'

const Post = ({ post }) => {
  const [showReason, setShowReason] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [postImage, setPostImage] = useState(null)
  
  useEffect(() => {
    // Set post image if available
    if (post.img) {
      setPostImage(post.img);
    }
  }, [post.img]);

  const likeHandler = () => {
    setIsLiked(!isLiked)
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
  };

  // Make sure description is available
  const description = post.description || '';

  return (
    <div className="postContainer">
      <div className="postHeader">
        <div className="headerLeft">
          <div className="userInfoArea">
            <Person fontSize="small" className="userIcon" />
            <span className="postUsername">{post.userId}</span>
          </div>
        </div>
        <div className="headerRight">
          <button 
            className={`whyButton ${showReason ? 'active' : ''}`}
            onClick={() => setShowReason(!showReason)}
          >
            <HelpOutline fontSize="small" />
            <span>Why?</span>
          </button>
        </div>
      </div>
      
      {showReason && (
        <div className="reasonPanel">
          <div className="reasonContent">
            <InfoOutlined fontSize="small" className="infoIcon" />
            <p>This post appears in your feed because it matches your interests.</p>
          </div>
          <div className="reasonActions">
            <button className="hideContentBtn">Hide similar</button>
            <button className="seeMoreBtn">See more like this</button>
          </div>
        </div>
      )}
      
      {/* Show image if we have one from useEffect */}
      {postImage && (
        <div className="imageWrapper">
          <img 
            src={postImage} 
            alt={`Post by ${post.userId}`} 
            className="postImage" 
            onError={handleImageError}
          />
          <div className="hoverOverlay">
            <div className="overlayContent">
              <span>{post.description}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="postContent">
        <p className="postCaption">
          <span className="captionUsername">{post.userId}</span> {description}
        </p>
        
        <div className="postStats">
          <div className="statItem">
            <LocalFlorist fontSize="small" className="statIcon" />
            <span>100 people found this valuable</span>
          </div>
        </div>
        
        <div className="postActions">
          <button className="actionButton likeButton" onClick={likeHandler}>
            <Favorite fontSize="small" className={isLiked ? "likeIcon liked" : "likeIcon"} />
            <span>Valuable</span>
          </button>
          <button className="actionButton">
            <Comment fontSize="small" />
            <span>Discuss</span>
          </button>
          <button className="actionButton">
            <Share fontSize="small" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Post
