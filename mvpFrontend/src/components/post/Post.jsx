/* eslint-disable react/prop-types */
import './post.css'
import { useState } from 'react'
import { Favorite, Share, Comment, LocalFlorist, HelpOutline, InfoOutlined } from '@mui/icons-material'

const Post = ({ date, likes, image, caption, user, reason, tags = [] }) => {
  const [showReason, setShowReason] = useState(false);

  // Generate a more detailed explanation based on the reason
  const getDetailedExplanation = () => {
    if (!reason) return null;
    
    if (reason.includes('follow')) {
      return `This post appears in your feed because you follow ${user}. Following accounts ensures you see their latest content.`;
    } else if (reason.includes('similar')) {
      return `Based on your engagement with ${tags.join(', ')} content, we thought you might enjoy this post about ${tags[0] || 'similar topics'}.`;
    } else if (reason.includes('communities')) {
      return `This post is popular in communities you're part of. ${likes} people in your network found this valuable.`;
    } else if (reason.includes('Trending')) {
      return `This content is currently trending in your region. It has received significant engagement in the past 24 hours.`;
    } else if (reason.includes('interest')) {
      return `You've shown interest in ${tags.join(', ')} content, so we're showing you more posts related to these topics.`;
    }
    return `This post matches your content preferences and feed settings.`;
  };

  // Use a default image if the provided one doesn't load
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80";
  };

  return (
    <div className="postContainer">
      <div className="postHeader">
        <p className="datePosted">{date}</p>
        <div className="headerRight">
          {reason && (
            <button 
              className={`whyButton ${showReason ? 'active' : ''}`}
              onClick={() => setShowReason(!showReason)}
            >
              <HelpOutline fontSize="small" />
              <span>Why?</span>
            </button>
          )}
        </div>
      </div>
      
      {reason && showReason && (
        <div className="reasonPanel">
          <div className="reasonContent">
            <InfoOutlined fontSize="small" className="infoIcon" />
            <p>{getDetailedExplanation()}</p>
          </div>
          <div className="reasonActions">
            <button className="hideContentBtn">Hide similar</button>
            <button className="seeMoreBtn">See more like this</button>
          </div>
        </div>
      )}
      
      <div className="imageWrapper">
        <img 
          src={image} 
          alt={`${user}'s post: ${caption.substring(0, 30)}...`} 
          className="postImage" 
          onError={handleImageError}
        />
        <div className="hoverOverlay">
          <div className="overlayContent">
            <span>{caption}</span>
          </div>
        </div>
      </div>
      
      <div className="postContent">
        <p className="postCaption">{caption}</p>
        
        <div className="postStats">
          <div className="statItem">
            <LocalFlorist fontSize="small" className="statIcon" />
            <span>{likes} people found this valuable</span>
          </div>
        </div>
        
        <div className="postActions">
          <button className="actionButton likeButton">
            <Favorite fontSize="small" />
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
