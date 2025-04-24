/* eslint-disable react/prop-types */
import './post.css'
import { useState, useEffect } from 'react'
import { Favorite, Share, Comment, HelpOutline, InfoOutlined } from '@mui/icons-material'
import axios from 'axios'
import {format} from "timeago.js"

const Post = ({ post }) => {
  const [showReason, setShowReason] = useState(false)
  const [likes, setLikes] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await axios.get(`/api/users/${post.user}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        setUser(response.data)
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    
    fetchUser();
  }, [post.user]);

  const likeHandler = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  if (!user) return null; // Don't render until user data is loaded

  return (
    <div className="postContainer">
      <div className="postHeader">
        <div className="headerLeft">
          <div className="userInfoArea">
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="userProfilePic"
            />
            <span className="postUsername">{user.firstName} {user.lastName}</span>
            <span className="postDate">{format(post.createdAt)}</span>
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


      <div className="imageWrapper">
        <img
          src={post.photo}
          alt={`Post by ${user.firstName} ${user.lastName}`}
          className="postImage"
        />
        <div className="hoverOverlay">
          <div className="overlayContent">
            <span>{post.description}</span>
          </div>
        </div>
      </div>


      <div className="postContent">
        <p className="postCaption">
          <span className="captionUsername">{post.description}</span>
        </p>

        <div className="postActions">
          <button className="actionButton likeButton" onClick={likeHandler}>
            <Favorite fontSize="small" className={isLiked ? "likeIcon liked" : "likeIcon"} />
            <span>Valuable</span>
            {likes > 0 && <span className="likeCount">{likes}</span>}
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
