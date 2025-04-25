import './user.css'
import { LocalFlorist, Favorite, PersonAdd, Message, LocationOn, EmojiEvents, VerifiedUser, Cake, Today } from '@mui/icons-material'
import { format } from 'timeago.js'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const User = ({ viewMode = 'grid'}) => {
  const { user } = useContext(AuthContext)
  // Create a proper date from createdAt if available
  const friendDate = user.createdAt ? format(new Date(user.createdAt)) : null;
  
  // Default values for now
  const mutualConnections = user.mutualConnections || Math.floor(Math.random() * 12);
  
  const isList = viewMode === 'list';

  // Format full name if available
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : null;
  
  return (
    <div className={`userContainer ${isList ? 'listView' : 'gridView'}`}>
      <div className={`userHeader ${isList ? 'listHeader' : ''}`}>
        <div className={`profilePictureWrapper ${user.isOnline ? 'online' : ''} ${isList ? 'listPicture' : ''}`}>
          <img src={user.profilePicture} alt={`${user.username}'s Profile`} className="profilePicture" />
          {user.isOnline && <div className="onlineIndicator"></div>}
        </div>
        
        <div className="userNameSection">
          <h3 className="userName">{user.username}</h3>
          {fullName && <span className="fullName">{fullName}</span>}
          {user.isOnline && <span className="onlineStatus">Online</span>}
          
          {isList && user.location && (
            <div className="userLocation">
              <LocationOn className="locationIcon" />
              <span>{user.location}</span>
            </div>
          )}
          
          {isList && user.age && (
            <div className="userAge">
              <Cake className="ageIcon" />
              <span>{user.age} years old</span>
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
            <Today className="dateIcon" />
            <span className="friendLabel">Member since:</span>
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
              {user.values.map((value, index) => (
                <span key={index} className="valueTag">
                  <EmojiEvents className="valueIcon" />
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {isList && user.personal && Object.keys(user.personal).length > 0 && (
          <div className="personalInfo">
            <h4 className="personalTitle">Personal Info</h4>
            <div className="personalDetails">
              {user.personal.birthday && (
                <div className="personalItem">
                  <Cake className="personalIcon" />
                  <span>{user.personal.birthday}</span>
                </div>
              )}
              {user.personal.country && (
                <div className="personalItem">
                  <LocationOn className="personalIcon" />
                  <span>{user.personal.city ? `${user.personal.city}, ${user.personal.country}` : user.personal.country}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isList && user.relationships && Object.keys(user.relationships).length > 0 && (
          <div className="relationshipsInfo">
            <h4 className="relationshipsTitle">Background</h4>
            <div className="relationshipsDetails">
              {user.relationships.education && (
                <div className="relationshipItem">
                  <span className="relationshipLabel">Education:</span>
                  <span className="relationshipValue">{user.relationships.education}</span>
                </div>
              )}
              {user.relationships.status && (
                <div className="relationshipItem">
                  <span className="relationshipLabel">Status:</span>
                  <span className="relationshipValue">{user.relationships.status}</span>
                </div>
              )}
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
