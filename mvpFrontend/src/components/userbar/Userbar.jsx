import Button from '../button/Button'
import './userbar.css'
import { VerifiedUser, LocationOn, Cake, Favorite, LocalFlorist } from '@mui/icons-material'

const Userbar = () => {
  return (
    <div className="userbarContainer">
      <div className="userbarLeft">
        <div className="statsContainer">
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">1,430</span>
            <span className="statLabel">Impact Points</span>
          </div>
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">86%</span>
            <span className="statLabel">Trust Rating</span>
          </div>
        </div>
      </div>

      <div className="userbarCenter">
        <div className="profileImageContainer">
          <img src="../../assets/person/profile.jpeg" alt="user profile picture" className="profileImage" />
        </div>
        <div className="profileInfo">
          <div className="nameContainer">
            <h1 className="profileName">Aaron Taylor</h1>
            <VerifiedUser className="verifiedIcon" titleAccess="Verified User" />
          </div>
          <div className="bioSection">
            <p className="bioText">Passionate about sustainable technology and authentic connections. Building a better social experience for everyone. Join me in creating a healthier digital environment.</p>
          </div>
          <div className="userDetails">
            <div className="detailItem">
              <Cake className="detailIcon" />
              <p className='subInfo'>23 Years Old</p>
            </div>
            <div className="detailItem">
              <LocationOn className="detailIcon" />
              <p className='subInfo'>Hamilton, New Zealand</p>
            </div>
            <div className="detailItem">
              <LocalFlorist className="detailIcon" />
              <p className='subInfo'>Environmentalist</p>
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