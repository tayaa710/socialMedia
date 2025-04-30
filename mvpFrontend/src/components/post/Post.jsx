/* eslint-disable react/prop-types */
import './post.css'
import { useState, useEffect, useContext } from 'react'
import { Favorite, Share, Comment, HelpOutline, InfoOutlined, Send, FavoriteBorder } from '@mui/icons-material'
import {format} from "timeago.js"
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { userAPI, postAPI } from '../../services/api'

const Post = ({ post }) => {
  const [showReason, setShowReason] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [likes, setLikes] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const {user:currentUser} = useContext(AuthContext)

  useEffect(() => {
    // Initialize comments from post data
    if (post.comments) {
      setComments(post.comments);
    }
  }, [post.comments]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser.id))
  }, [post.likes, currentUser.id])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If post.user is already populated and has all the data we need, use it directly
        if (typeof post.user === 'object' && post.user !== null && post.user.firstName) {
          setUser(post.user);
        } else {
          // Otherwise fetch the user data using the user ID
          const userId = typeof post.user === 'object' ? post.user._id : post.user;
          const userData = await userAPI.getUser(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } 
    };
    
    fetchUser();
  }, [post.user]);

  const likeHandler = async () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    try{
      console.log('liking post')
      await postAPI.likePost(post.id)
    }catch(err){
      setIsLiked(!isLiked)
      setLikes(isLiked ? likes - 1 : likes + 1)
      console.error("Failed to like post:", err);
    }
  }

  const handleCommentLike = async (commentId) => {
    try {
      const updatedPost = await postAPI.likeComment(post.id, commentId)
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments)
      }
    } catch(err) {
      console.error("Failed to like/unlike comment:", err)
    }
  }

  const handleReplyLike = async (commentId, replyId) => {
    try {
      const updatedPost = await postAPI.likeReply(post.id, commentId, replyId)
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments)
      }
    } catch(err) {
      console.error("Failed to like/unlike reply:", err)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    
    try {
      const updatedPost = await postAPI.addComment(post.id, commentText)
      setCommentText('')
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments)
      }
    } catch(err) {
      console.error("Failed to add comment:", err)
    }
  }

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault()
    if (!replyText.trim()) return
    
    try {
      const updatedPost = await postAPI.addReply(post.id, commentId, replyText)
      setReplyText('')
      setReplyingTo(null)
      
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments)
      }
    } catch(err) {
      console.error("Failed to add reply:", err)
    }
  }

  const toggleReplyForm = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
      setReplyText('')
    } else {
      setReplyingTo(commentId)
      setReplyText('')
    }
  }

  // Check if the current user has liked a specific comment
  const isCommentLiked = (comment) => {
    return comment.likes && comment.likes.includes(currentUser.id)
  }

  // Check if the current user has liked a specific reply
  const isReplyLiked = (reply) => {
    return reply.likes && reply.likes.includes(currentUser.id)
  }

  if (!user) return null; // Don't render until user data is loaded

  return (
    <div className="postContainer">
      <div className="postHeader">
        <div className="headerLeft">
          <div className="userInfoArea">
            <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }} className="userProfileLink">
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="userProfilePic"
              />
              <span className="postUsername">{user.firstName} {user.lastName}</span>
              <span className="postDate">{format(post.createdAt)}</span>
            </Link>
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
        {post.photo && (
          <img
            src={post.photo}
            alt={`Post by ${user.firstName} ${user.lastName}`}
            className="postImage"
          />
        )}
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
        
        {post.imageAnalysis?.caption && (
          <div className="aiCaption">
            <span className="aiLabel">AI Description:</span>
            <span className="captionText">{post.imageAnalysis.caption}</span>
          </div>
        )}

        <div className="postActions">
          <button className="actionButton likeButton" onClick={likeHandler}>
            <Favorite fontSize="small" className={isLiked ? "likeIcon liked" : "likeIcon"} />
            <span>Valuable</span>
            {likes > 0 && <span className="likeCount">{likes}</span>}
          </button>
          <button 
            className={`actionButton ${showComments ? 'active' : ''}`} 
            onClick={toggleComments}
          >
            <Comment fontSize="small" className={showComments ? "greenIcon" : ""} />
            <span>Discuss</span>
            {comments.length > 0 && <span className="commentCount">{comments.length}</span>}
          </button>
          <button className="actionButton">
            <Share fontSize="small" />
            <span>Share</span>
          </button>
        </div>

        {showComments && (
          <div className="commentsSection">
            <form className="commentForm" onSubmit={handleCommentSubmit}>
              <img 
                src={currentUser.profilePicture} 
                alt="Profile" 
                className="commentUserPic"
              />
              <div className="commentInputWrapper">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="commentInput"
                />
                <button 
                  type="submit" 
                  className="commentSubmitBtn"
                  disabled={!commentText.trim()}
                >
                  <Send fontSize="small" />
                </button>
              </div>
            </form>
            
            <div className="commentsList">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="commentItem">
                    <img 
                      src={comment.user.profilePicture || "/assets/person/noAvatar.png"} 
                      alt="Profile" 
                      className="commentUserPic"
                    />
                    <div className="commentContent">
                      <div className="commentUserName">{comment.user.firstName} {comment.user.lastName}</div>
                      <div className="commentText">{comment.comment}</div>
                      <div className="commentActions">
                        <span 
                          className={`commentAction ${isCommentLiked(comment) ? 'liked' : ''}`}
                          onClick={() => handleCommentLike(comment._id)}
                        >
                          {isCommentLiked(comment) ? (
                            <>
                              <Favorite className="likeActionIcon" fontSize="small" />
                              <span>Liked</span>
                              {comment.likes && comment.likes.length > 0 && (
                                <span className="likeCount">{comment.likes.length}</span>
                              )}
                            </>
                          ) : (
                            <>
                              <FavoriteBorder className="likeActionIcon" fontSize="small" />
                              <span>Like</span>
                              {comment.likes && comment.likes.length > 0 && (
                                <span className="likeCount">{comment.likes.length}</span>
                              )}
                            </>
                          )}
                        </span>
                        <span 
                          className="commentAction"
                          onClick={() => toggleReplyForm(comment._id)}
                        >
                          Reply
                        </span>
                        <span className="commentTime">{format(comment.createdAt)}</span>
                      </div>
                      
                      {/* Reply Form */}
                      {replyingTo === comment._id && (
                        <form 
                          className="replyForm" 
                          onSubmit={(e) => handleReplySubmit(e, comment._id)}
                        >
                          <img 
                            src={currentUser.profilePicture || "/assets/person/noAvatar.png"} 
                            alt="Profile" 
                            className="replyUserPic"
                          />
                          <div className="replyInputWrapper">
                            <input
                              type="text"
                              placeholder={`Reply to ${comment.user.firstName}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="replyInput"
                              autoFocus
                            />
                            <button 
                              type="submit" 
                              className="replySubmitBtn"
                              disabled={!replyText.trim()}
                            >
                              <Send fontSize="small" />
                            </button>
                          </div>
                        </form>
                      )}
                      
                      {/* Replies List */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="repliesList">
                          {comment.replies.map((reply, replyIndex) => (
                            <div key={replyIndex} className="replyItem">
                              <img 
                                src={reply.user.profilePicture || "/assets/person/noAvatar.png"} 
                                alt="Profile" 
                                className="replyUserPic"
                              />
                              <div className="replyContent">
                                <div className="replyUserName">{reply.user.firstName} {reply.user.lastName}</div>
                                <div className="replyText">{reply.reply}</div>
                                <div className="replyActions">
                                  <span 
                                    className={`replyAction ${isReplyLiked(reply) ? 'liked' : ''}`}
                                    onClick={() => handleReplyLike(comment._id, reply._id)}
                                  >
                                    {isReplyLiked(reply) ? (
                                      <>
                                        <Favorite className="likeActionIcon" fontSize="small" />
                                        <span>Liked</span>
                                        {reply.likes && reply.likes.length > 0 && (
                                          <span className="likeCount">{reply.likes.length}</span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <FavoriteBorder className="likeActionIcon" fontSize="small" />
                                        <span>Like</span>
                                        {reply.likes && reply.likes.length > 0 && (
                                          <span className="likeCount">{reply.likes.length}</span>
                                        )}
                                      </>
                                    )}
                                  </span>
                                  <span className="replyTime">{format(reply.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="noComments">Be the first to comment on this post!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
