import './postContent.css';

const PostContent = ({ post, user }) => {
  // Determine if this is a text-only post
  const isTextOnly = !post.photo;

  return (
    <>
      {post.photo && (
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
      )}

      <div className={`postContentText ${isTextOnly ? 'textOnly' : ''}`}>
        <p className="postCaption">
          <span className="captionUsername">{post.description}</span>
        </p>
      </div>
    </>
  );
};

export default PostContent; 