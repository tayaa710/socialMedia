import './postContent.css';

const PostContent = ({ post, user }) => {
  return (
    <>
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

      <div className="postContentText">
        <p className="postCaption">
          <span className="captionUsername">{post.description}</span>
        </p>
        
        {post.imageAnalysis?.caption && (
          <div className="aiCaption">
            <span className="aiLabel">AI Description:</span>
            <span className="captionText">{post.imageAnalysis.caption}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default PostContent; 