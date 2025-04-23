import './user.css'
import { LocalFlorist, Favorite, PersonAdd, Message } from '@mui/icons-material'


const User = ({user}) => {
  // Generate a random date from the past 3 years
  const randomMonths = Math.floor(Math.random() * 36); // Random number between 0-36 months
  const date = new Date();
  date.setMonth(date.getMonth() - randomMonths);
  const friendDate = date.toLocaleDateString();
  
  // Default values for now
  const mutualConnections = user.mutualConnections || Math.floor(Math.random() * 12);
  
  return (
    <div className="userContainer">
      <div className="userHeader">
        <div className={`profilePictureWrapper ${user.isOnline ? 'online' : ''}`}>
          <img src={user.profilePicture} alt={`${user.username}'s Profile`} className="profilePicture" />
          {user.isOnline && <div className="onlineIndicator"></div>}
        </div>
        
        <h3 className="userName">{user.username}</h3>
        {user.isOnline && <span className="onlineStatus">Online</span>}
      </div>

      <div className="userInfo">
        {friendDate && (
          <div className="friendSince">
            <span className="friendLabel">Connected since:</span>
            <span className="friendDate">{friendDate}</span>
          </div>
        )}
        
        {user.interests && user.interests.length > 0 && (
          <div className="interestsContainer">
            {user.interests.map((interest, index) => (
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
