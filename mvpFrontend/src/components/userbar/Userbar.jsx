/* eslint-disable react/prop-types */
import Button from '../button/Button'
import './userbar.css'
import { VerifiedUser, LocationOn, Cake, LocalFlorist } from '@mui/icons-material'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { FRIEND_UPDATE_EVENT } from '../profileFriends/ProfileFriends'

const Userbar = ({ profileUser }) => {
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const user = profileUser || currentUser
  const [localUser, setLocalUser] = useState(user)
  // Add a separate state for tracking friend status
  const [isFriend, setIsFriend] = useState(false)
  
  // Update localUser when profileUser changes
  useEffect(() => {
    if (profileUser || currentUser) {
      const currentUserToShow = profileUser || currentUser
      setLocalUser(currentUserToShow)
    }
  }, [profileUser, currentUser])
  
  // Determine friend status when users change
  useEffect(() => {
    if (profileUser && currentUser && localUser.friends) {
      const friendStatus = localUser.friends.some(friend => 
        friend.id === currentUser.id || 
        (typeof friend === 'string' && friend === currentUser.id)
      )
      setIsFriend(friendStatus)
    }
  }, [profileUser, currentUser, localUser])

  const editProfile = () => {
    console.log('Edit profile clicked')
  }

  // Dispatch friend update event
  const notifyFriendUpdate = (userId) => {
    const event = new CustomEvent(FRIEND_UPDATE_EVENT, {
      detail: { userId }
    })
    window.dispatchEvent(event)
  }

  const addFriend = async (userId) => {
    try {
      await userAPI.addFriend(userId);
      
      // Immediately update friend status in UI
      setIsFriend(true)
      
      // Update local state for immediate UI feedback
      const updatedUser = { 
        ...localUser,
        friends: [...(localUser.friends || []), { id: userId }]
      }
      setLocalUser(updatedUser)
      
      // If this is for the current user, update the global auth context
      if (!profileUser) {
        dispatch({ 
          type: "UPDATE_USER", 
          payload: updatedUser
        })
      }
      
      // Fetch updated user data to ensure consistency
      fetchUpdatedUserData(profileUser ? profileUser.id : currentUser.id)
      
      // Notify other components about the friend update
      notifyFriendUpdate(userId)
      notifyFriendUpdate(currentUser.id)
    } catch (error) {
      console.error("Failed to add friend:", error)
    }
  }

  const unfriend = async (userId) => {
    try {
      await userAPI.removeFriend(userId);
      
      // Immediately update friend status in UI
      setIsFriend(false)
      
      // Update local state for immediate UI feedback
      const updatedUser = {
        ...localUser,
        friends: (localUser.friends || []).filter(friend => 
          (friend.id && friend.id !== userId) || 
          (typeof friend === 'string' && friend !== userId)
        )
      }
      setLocalUser(updatedUser)
      
      // If this is for the current user, update the global auth context
      if (!profileUser) {
        dispatch({
          type: "UPDATE_USER",
          payload: updatedUser
        })
      }
      
      // Fetch updated user data to ensure consistency
      fetchUpdatedUserData(profileUser ? profileUser.id : currentUser.id)
      
      // Notify other components about the friend update
      notifyFriendUpdate(userId)
      notifyFriendUpdate(currentUser.id)
    } catch (error) {
      console.error("Failed to remove friend:", error)
      // Handle 409 conflict - users might not be friends
      if (error.response && error.response.status === 409) {
        console.log("Users are not friends or already unfriended")
        setIsFriend(false)
      }
    }
  }
  
  // Function to fetch updated user data after friend actions
  const fetchUpdatedUserData = async (userId) => {
    try {
      const userData = await userAPI.getUser(userId);
      
      if (userId === currentUser.id) {
        // Update global context if it's the current user
        dispatch({ 
          type: "UPDATE_USER", 
          payload: userData
        })
      }
      
      // If this is the profile we're viewing, update local state
      if (profileUser && profileUser.id === userId) {
        setLocalUser(userData)
      }
    } catch (error) {
      console.error("Failed to fetch updated user data:", error)
    }
  }

  return (
    <div className="userbarContainer">
      <div className="userbarLeft">
        <div className="statsContainer">
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{localUser.impactPoints}</span>
            <span className="statLabel">Impact Points</span>
          </div>
          <div className="statItem">
            <LocalFlorist className="statIcon" />
            <span className="statCount">{localUser.trustRating}</span>
            <span className="statLabel">Trust Rating</span>
          </div>
        </div>
      </div>

      <div className="userbarCenter">
        <div className="profileImageContainer">
          <img src={localUser.profilePicture} alt={`${localUser.username}'s profile picture`} className="profileImage" />
        </div>
        <div className="profileInfo">
          <div className="nameContainer">
            <h1 className="profileName">{localUser.username}</h1>
            <VerifiedUser className="verifiedIcon" titleAccess="Verified User" />
          </div>
          <div className="bioSection">
            <p className="bioText">{localUser.bio}</p>
          </div>
          <div className="userDetails">
            <div className="detailItem">
              <Cake className="detailIcon" />
              <p className='subInfo'>{localUser.age} Years Old</p>
            </div>
            <div className="detailItem">
              <LocationOn className="detailIcon" />
              <p className='subInfo'>{localUser.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="userbarRight">
        <div className="actionButtons">
          {profileUser && (
            <>
              {currentUser.id === profileUser.id ? (
                <Button message="Edit Profile" className="primaryBtn" onClick={editProfile} />
              ) : (
                <Button 
                  message={isFriend ? "Remove Friend" : "Add Friend"} 
                  className="primaryBtn" 
                  onClick={() => isFriend ? unfriend(profileUser.id) : addFriend(profileUser.id)} 
                />
              )}
              {currentUser.id !== profileUser.id && (
                <Button message="Message" className="secondaryBtn" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Userbar