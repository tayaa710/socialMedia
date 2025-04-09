/* eslint-disable react/prop-types */

import './user.css'
import { LocalFlorist, Favorite } from '@mui/icons-material'

export default function User({name, interests = [], friendDate}) {
  return (
    <div className="userContainer">
      <img src="../../assets/postReal/daffy.jpeg" alt="Profile Picture" className="profilePicture" />
      
      <div className="userInfo">
        <h3 className="userName">{name}</h3>
        
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
      
      <div className="bottomBar">
        <div className="mutualFriendsWrapper">
          <Favorite className="mutualIcon" />
          <p className="mutualFriends">982 mutual friends</p>
        </div>
        <button className="connectButton">Connect</button>
      </div>
    </div>
  )
}
