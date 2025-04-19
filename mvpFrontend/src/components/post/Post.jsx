/* eslint-disable react/prop-types */
import './post.css'
import { Favorite, VerifiedUser, Share, Comment, LocalFlorist } from '@mui/icons-material'

const Post = ({date, likes, image, caption, verified = false}) => {
  return (
    <div className="postContainer">
      <div className="postHeader">
        <p className="datePosted">{date}</p>
        {verified && (
          <div className="verifiedBadge" title="Verified Content">
            <VerifiedUser fontSize="small" /> <span>Verified Content</span>
          </div>
        )}
      </div>
      
      <div className="imageWrapper">
        <img src={image} alt="Post content" className="postImage" />
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
