import './postHeader.css';
import { useState } from 'react';
import { HelpOutline, InfoOutlined } from '@mui/icons-material';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const PostHeader = ({ user, createdAt }) => {
  const [showReason, setShowReason] = useState(false);

  return (
    <>
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
              <span className="postDate">{format(createdAt)}</span>
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
    </>
  );
};

export default PostHeader; 