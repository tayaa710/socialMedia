import './comments.css';
import { useState, useContext } from 'react';
import { Favorite, Send, FavoriteBorder } from '@mui/icons-material';
import { format } from 'timeago.js';
import { AuthContext } from '../../context/AuthContext';
import { postAPI } from '../../services/api';

const Comments = ({ post, comments, setComments }) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  console.log(comments)
  
  const { user: currentUser } = useContext(AuthContext);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const updatedPost = await postAPI.addComment(post.id, commentText);
      setCommentText('');
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments);
      }
    } catch(err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      const updatedPost = await postAPI.addReply(post.id, commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
      
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments);
      }
    } catch(err) {
      console.error("Failed to add reply:", err);
    }
  };

  const toggleReplyForm = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText('');
    } else {
      setReplyingTo(commentId);
      setReplyText('');
    }
  };

  const handleCommentLike = async (commentId) => {
    console.log(commentId)
    try {
      const updatedPost = await postAPI.likeComment(post.id, commentId);
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments);
      }
    } catch(err) {
      console.error("Failed to like/unlike comment:", err);
    }
  };

  const handleReplyLike = async (commentId, replyId) => {
    try {
      const updatedPost = await postAPI.likeReply(post.id, commentId, replyId);
      // Update comments from the updated post data
      if (updatedPost && updatedPost.comments) {
        setComments(updatedPost.comments);
      }
    } catch(err) {
      console.error("Failed to like/unlike reply:", err);
    }
  };

  // Check if the current user has liked a specific comment
  const isCommentLiked = (comment) => {
    return comment.likes && comment.likes.includes(currentUser.id);
  };

  // Check if the current user has liked a specific reply
  const isReplyLiked = (reply) => {
    return reply.likes && reply.likes.includes(currentUser.id);
  };

  return (
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
                    onClick={() => handleCommentLike(comment.id)}
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
                    onClick={() => toggleReplyForm(comment.id)}
                  >
                    Reply
                  </span>
                  <span className="commentTime">{format(comment.createdAt)}</span>
                </div>
                
                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form 
                    className="replyForm" 
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
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
                              onClick={() => handleReplyLike(comment.id, reply.id)}
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
  );
};

export default Comments; 