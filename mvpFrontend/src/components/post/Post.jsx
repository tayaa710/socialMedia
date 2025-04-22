/* eslint-disable react/prop-types */
import './post.css'
import { useState } from 'react'
import { Favorite, Share, Comment, LocalFlorist, HelpOutline, InfoOutlined, Person } from '@mui/icons-material'
import { Users } from "../../dummyData"

const Post = ({ post, date, likes, image, caption, user, reason, tags = [] }) => {
  // Support both formats - direct props and post object
  const postDate = date || post?.date;
  const postLikes = likes || post?.like;
  const postImage = image || post?.photo;
  const postCaption = caption || post?.desc;
  const postUserId = post?.userId;
  
  // If we have a post object with userId, get the user from Users data
  const userData = postUserId ? Users.filter(u => u.id === postUserId)[0] : null;
  const postUser = user || userData?.username;
  const postReason = reason || (userData ? `Post by ${userData.username}` : null);
  
  const [like, setLike] = useState(postLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [showReason, setShowReason] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  };

  // Generate a more detailed explanation based on the reason
  const getDetailedExplanation = () => {
    if (!postReason) return null;
    
    if (postReason.includes('follow')) {
      return `This post appears in your feed because you follow ${postUser}. Following accounts ensures you see their latest content.`;
    } else if (postReason.includes('similar')) {
      return `Based on your engagement with ${tags.join(', ')} content, we thought you might enjoy this post about ${tags[0] || 'similar topics'}.`;
    } else if (postReason.includes('communities')) {
      return `This post is popular in communities you're part of. ${like} people in your network found this valuable.`;
    } else if (postReason.includes('Trending')) {
      return `This content is currently trending in your region. It has received significant engagement in the past 24 hours.`;
    } else if (postReason.includes('interest')) {
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
        <div className="headerLeft">
          <div className="userInfoArea">
            <Person fontSize="small" className="userIcon" />
            <span className="postUsername">{postUser}</span>
          </div>
          <p className="datePosted">{postDate}</p>
        </div>
        <div className="headerRight">
          {postReason && (
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
      
      {postReason && showReason && (
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
          src={postImage} 
          alt={`${postUser}'s post: ${postCaption?.substring(0, 30) || ''}...`} 
          className="postImage" 
          onError={handleImageError}
        />
        <div className="hoverOverlay">
          <div className="overlayContent">
            <span>{postCaption}</span>
          </div>
        </div>
      </div>
      
      <div className="postContent">
        <p className="postCaption">
          <span className="captionUsername">{postUser}</span> {postCaption}
        </p>
        
        <div className="postStats">
          <div className="statItem">
            <LocalFlorist fontSize="small" className="statIcon" />
            <span>{like} people found this valuable</span>
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
