/* eslint-disable react/prop-types */

import './user.css'

export default function User({name}) {
  return (
    <div className="userContainer">
      <p className="userName">{name}</p>
      <img src="../../assets/postReal/daffy.jpeg" alt="Profile Picture" className="profilePicture" />
      <div className="bottomBar">
        <p className="mutualFriends">982 mutual friends</p>
        <button className="followButton">Follow</button>
      </div>
    </div>
  )
}
