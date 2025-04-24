import './user.css'
import { LocalFlorist, Favorite, PersonAdd, Message, LocationOn, EmojiEvents, VerifiedUser } from '@mui/icons-material'

const User = ({user, viewMode = 'grid'}) => {
  // Generate a random date from the past 3 years
  const randomMonths = Math.floor(Math.random() * 36); // Random number between 0-36 months
  const date = new Date();
  date.setMonth(date.getMonth() - randomMonths);
  const friendDate = date.toLocaleDateString();
  
  // Default values for now
  const mutualConnections = user.mutualConnections || Math.floor(Math.random() * 12);
  
  const isList = viewMode === 'list';
  
  return (
    <div className={`userContainer ${isList ? 'listView' : 'gridView'}`}>
      <div className={`userHeader ${isList ? 'listHeader' : ''}`}>
        <div className={`profilePictureWrapper ${user.isOnline ? 'online' : ''} ${isList ? 'listPicture' : ''}`}>
          <img src={user.profilePicture} alt={`${user.username}'s Profile`} className="profilePicture" />
          {user.isOnline && <div className="onlineIndicator"></div>}
        </div>
        
        <div className="userNameSection">
          <h3 className="userName">{user.username}</h3>
          {user.isOnline && <span className="onlineStatus">Online</span>}
          
          {isList && user.location && (
            <div className="userLocation">
              <LocationOn className="locationIcon" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {isList && user.bio && (
        <div className="userBio">
          <p>{user.bio}</p>
        </div>
      )}

      <div className={`userInfo ${isList ? 'listInfo' : ''}`}>
        {friendDate && (
          <div className="friendSince">
            <span className="friendLabel">Connected since:</span>
            <span className="friendDate">{friendDate}</span>
          </div>
        )}
        
        {isList && (
          <div className="userStats">
            {user.impactPoints !== undefined && (
              <div className="statItem">
                <LocalFlorist className="statIcon" />
                <span className="statValue">{user.impactPoints}</span>
                <span className="statLabel">Impact</span>
              </div>
            )}
            
            {user.trustRating !== undefined && (
              <div className="statItem">
                <VerifiedUser className="statIcon" />
                <span className="statValue">{user.trustRating}</span>
                <span className="statLabel">Trust</span>
              </div>
            )}
          </div>
        )}
        
        {user.interests && user.interests.length > 0 && (
          <div className={`interestsContainer ${isList ? 'listInterests' : ''}`}>
            {(isList ? user.interests : user.interests.slice(0, 2)).map((interest, index) => (
              <span key={index} className="interestTag">
                <LocalFlorist className="interestIcon" />
                {interest}
              </span>
            ))}
          </div>
        )}
        
        {isList && user.values && user.values.length > 0 && (
          <div className="valuesContainer">
            <h4 className="valuesTitle">Core Values</h4>
            <div className="valuesList">
              {user.values.slice(0, 3).map((value, index) => (
                <span key={index} className="valueTag">
                  <EmojiEvents className="valueIcon" />
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className={`userActions ${isList ? 'listActions' : ''}`}>
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
