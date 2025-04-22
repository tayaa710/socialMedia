import Button from '../button/Button'
import './userbar.css'
import { VerifiedUser, LocationOn, Cake, Favorite, LocalFlorist } from '@mui/icons-material'
import { useEffect, useState } from 'react'

const Userbar = ({ username }) => {
  const [userData, setUserData] = useState({
    name: "Aaron Taylor",
    bio: "Passionate about sustainable technology and authentic connections. Building a better social experience for everyone. Join me in creating a healthier digital environment.",
    age: "23",
    location: "Hamilton, New Zealand",
    interest: "Environmentalist",
    impactPoints: "1,430",
    trustRating: "86%",
    profilePicture: "../../assets/person/profile.jpeg"
  })
  
  useEffect(() => {
    // Use default profile data or customize based on username
    if (username && username !== "Aaron") {
      setUserData({
        name: username,
        bio: `This is ${username}'s profile.`,
        age: "—",
        location: "New Zealand",
        interest: "Sustainability",
        impactPoints: "0",
        trustRating: "0%",
        profilePicture: "https://via.placeholder.com/150"
      });
    }
  }, [username]);

  return (
    <div className="userbarContainer">
      <div className="userbarLeft">
        <div className="statsContainer">
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{userData.impactPoints}</span>
            <span className="statLabel">Impact Points</span>
          </div>
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{userData.trustRating}</span>
            <span className="statLabel">Trust Rating</span>
          </div>
        </div>
      </div>

      <div className="userbarCenter">
        <div className="profileImageContainer">
          <img src={userData.profilePicture} alt={`${userData.name}'s profile picture`} className="profileImage" />
        </div>
        <div className="profileInfo">
          <div className="nameContainer">
            <h1 className="profileName">{userData.name}</h1>
            <VerifiedUser className="verifiedIcon" titleAccess="Verified User" />
          </div>
          <div className="bioSection">
            <p className="bioText">{userData.bio}</p>
          </div>
          <div className="userDetails">
            <div className="detailItem">
              <Cake className="detailIcon" />
              <p className='subInfo'>{userData.age} Years Old</p>
            </div>
            <div className="detailItem">
              <LocationOn className="detailIcon" />
              <p className='subInfo'>{userData.location}</p>
            </div>
            <div className="detailItem">
              <LocalFlorist className="detailIcon" />
              <p className='subInfo'>{userData.interest}</p>
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