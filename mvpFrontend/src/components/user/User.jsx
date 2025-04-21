/* eslint-disable react/prop-types */

import './user.css'
import { LocalFlorist, Favorite, PersonAdd, Message } from '@mui/icons-material'

// Generate a random profile photo URL based on user ID or name
const getProfilePhoto = (name, id = null) => {
  const seed = id || name.toLowerCase().replace(/\s+/g, '');
  const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'croodles', 'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei', 'micah', 'miniavs', 'open-peeps', 'personas', 'pixel-art'];
  const style = styles[Math.floor(Math.abs(hashCode(seed)) % styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}

// Simple hash function for generating consistent random values
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const User = ({name, interests = [], friendDate, isOnline = false, id = null, mutualConnections = 0}) => {
  return (
    <div className="userContainer">
      <div className="userHeader">
        <div className={`profilePictureWrapper ${isOnline ? 'online' : ''}`}>
          <img src={getProfilePhoto(name, id)} alt={`${name}'s Profile`} className="profilePicture" />
          {isOnline && <div className="onlineIndicator"></div>}
        </div>
        
        <h3 className="userName">{name}</h3>
        {isOnline && <span className="onlineStatus">Online</span>}
      </div>

      <div className="userInfo">
        {friendDate && (
          <div className="friendSince">
            <span className="friendLabel">Connected since:</span>
            <span className="friendDate">{friendDate}</span>
          </div>
        )}
        
        {interests && interests.length > 0 && (
          <div className="interestsContainer">
            {interests.map((interest, index) => (
              <span key={index} className="interestTag">
                <LocalFlorist className="interestIcon" />
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="userActions">
        <button className="actionButton primary">
          <PersonAdd className="actionIcon" />
          <span>Connect</span>
        </button>
        <button className="actionButton secondary">
          <Message className="actionIcon" />
          <span>Message</span>
        </button>
      </div>
      
      <div className="bottomBar">
        <div className="mutualFriendsWrapper">
          <Favorite className="mutualIcon" />
          <p className="mutualFriends">{mutualConnections} mutual connections</p>
        </div>
      </div>
    </div>
  )
}

export default User
