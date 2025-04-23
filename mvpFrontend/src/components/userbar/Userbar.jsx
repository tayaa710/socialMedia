import Button from '../button/Button'
import './userbar.css'
import { VerifiedUser, LocationOn, Cake, LocalFlorist } from '@mui/icons-material'

const Userbar = ({ user }) => {

  return (
    <div className="userbarContainer">
      <div className="userbarLeft">
        <div className="statsContainer">
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{user.impactPoints}</span>
            <span className="statLabel">Impact Points</span>
          </div>
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{user.trustRating}</span>
            <span className="statLabel">Trust Rating</span>
          </div>
        </div>
      </div>

      <div className="userbarCenter">
        <div className="profileImageContainer">
          <img src={user.profilePicture} alt={`${user.username}'s profile picture`} className="profileImage" />
        </div>
        <div className="profileInfo">
          <div className="nameContainer">
            <h1 className="profileName">{user.username}</h1>
            <VerifiedUser className="verifiedIcon" titleAccess="Verified User" />
          </div>
          <div className="bioSection">
            <p className="bioText">{user.bio}</p>
          </div>
          <div className="userDetails">
            <div className="detailItem">
              <Cake className="detailIcon" />
              <p className='subInfo'>{user.age} Years Old</p>
            </div>
            <div className="detailItem">
              <LocationOn className="detailIcon" />
              <p className='subInfo'>{user.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="userbarRight">
        <div className="actionButtons">
          <Button message="Connect" className="primaryBtn" />
          <Button message="Message" className="secondaryBtn" />
        </div>
      </div>
    </div>
  )
}

export default Userbar