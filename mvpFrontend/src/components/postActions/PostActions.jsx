import './postActions.css';
import { useState, useEffect, useContext } from 'react';
import { Favorite, Share, Comment } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { postAPI } from '../../services/api';

const PostActions = ({ post, comments, showComments, setShowComments }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser.id));
  }, [post.likes, currentUser.id]);

  const likeHandler = async () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try {
      await postAPI.likePost(post.id);
    } catch(err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      console.error("Failed to like post:", err);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
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
  );
};

export default PostActions; 