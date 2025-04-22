/* eslint-disable react/prop-types */
import './post.css'
import { useState } from 'react'
import { Favorite, Share, Comment, LocalFlorist, HelpOutline, InfoOutlined, Person } from '@mui/icons-material'
import { Users } from "../../dummyData"


const Post = ({ post }) => {
  const [showReason, setShowReason] = useState(false)
  const [like, setLike] = useState(post.like)
  const user = Users.filter(user => user.id === post.userId)[0]
  const [isLiked, setIsLiked] = useState(false)

  const likeHandler = () => {
    setIsLiked(!isLiked)
    setLike(isLiked ? like - 1 : like + 1)
  }

  return (
    <div className="postContainer">
      <div className="postHeader">
        <div className="headerLeft">
          <div className="userInfoArea">
            <Person fontSize="small" className="userIcon" />
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{post.date}</span>
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
          alt={`Post by ${user.username}`}
          className="postImage"
        />
        <div className="hoverOverlay">
          <div className="overlayContent">
            <span>{post.desc}</span>
          </div>
        </div>
      </div>


      <div className="postContent">
        <p className="postCaption">
          <span className="captionUsername">{post.desc}</span>
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
