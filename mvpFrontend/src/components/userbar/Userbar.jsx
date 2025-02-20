import Button from '../button/Button'
import './userbar.css'

const Userbar = () => {
  return (
    <div className="userbarContainer">
      <div className="userbarLeft">
      </div>

      <div className="userbarCenter">
        <img src="../../assets/person/profile.jpeg" alt="user profile picture" className="profileImage" />
        <div className="profileInfo">
          <h1 className="profileName">Aaron Taylor</h1>
            <p className='subInfo'>23 Years Old</p>
            <p className='subInfo'>Hamilton, New Zealand</p>
        </div>
        <div className="actionButtons">
          <Button message ="Follow" />
        </div>
      </div>

      <div className="userbarRight">
      </div>
    </div>
  )
}

export default Userbar