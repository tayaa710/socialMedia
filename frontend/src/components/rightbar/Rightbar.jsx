import './rightbar.css'
import { Users } from "../../dummyData"
import Online from '../online/Online'

const Rightbar = ({ profile }) => {



  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>

  )
}

const ProfileRightbar = () => {
  return (
    <>
      <h4 className='rightbarTitle'>User information</h4>
      <div className="rightbarInfo">

        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City: </span>
          <span className="rightbarInfoValue">Hamilton</span>
        </div>

        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Country: </span>
          <span className="rightbarInfoValue">New Zealand</span>
        </div>

        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship: </span>
          <span className="rightbarInfoValue">Taken</span>
        </div>
      </div>
      <h4 className="rightbarTitle">User friends</h4>

      <div className="rightbarFollowings">

        <div className="rightbarFollowing">
          <img src="assets/person/1.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

        <div className="rightbarFollowing">
          <img src="assets/person/2.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

        <div className="rightbarFollowing">
          <img src="assets/person/3.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

        <div className="rightbarFollowing">
          <img src="assets/person/4.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

        <div className="rightbarFollowing">
          <img src="assets/person/5.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

        <div className="rightbarFollowing">
          <img src="assets/person/6.jpeg" alt="" className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">Harry Potter</span>
        </div>

      </div>
    </>
  )
}

const HomeRightbar = () => {
  return (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImg" src="assets/gift.png" alt="" />
        <span className="birthdayText">
          <b>Haggis</b> and <b>3 other friends</b> have a birthday today
        </span>
      </div>
      <img src="assets/ad.png" alt="" className="rightbarAd" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map(user => <Online key={user.id} user={user} />)}
      </ul>
    </>
  )
}

export default Rightbar