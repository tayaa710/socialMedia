import './sidebar.css'
import { Message } from "@mui/icons-material"
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch friends data when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        // Make sure we're passing a string ID, not an object
        const userId = typeof user.id === 'object' ? user.id._id || user.id.id : user.id
        const userData = await userAPI.getUser(userId)
        setFriends(userData.friends || [])
      } catch (error) {
        console.error("Failed to fetch friends:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [user])

  const handleMessageClick = (friend) => {
    console.log(`Message button clicked for ${friend.username}`)
  }

  return (
    <div className="sidebarWrapper">
      <h3 className="sidebarTitle">Friends</h3>
      
      {loading ? (
        <div className="sidebarLoadingState">Loading friends...</div>
      ) : friends.length > 0 ? (
        <ul className="sidebarFriendList">
          {friends.map((friend) => (
            <li className="sidebarFriend" key={friend._id || friend.id}>
              <Link to={`/profile/${friend._id || friend.id}`} className="sidebarFriendLink">
                <div className={`sidebarFriendImgContainer ${friend.isOnline ? 'online' : ''}`}>
                  <img 
                    src={friend.profilePicture} 
                    alt={friend.username} 
                    className="sidebarFriendImg" 
                  />
                  {friend.isOnline && <div className="sidebarOnlineBadge"></div>}
                </div>
                <span className="sidebarFriendName">{friend.username}</span>
              </Link>
              <button 
                className="sidebarMessageBtn" 
                onClick={(e) => {
                  e.preventDefault()
                  handleMessageClick(friend)
                }}
              >
                <Message className="sidebarMessageIcon" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="sidebarNoFriends">
          <p>No friends found</p>
        </div>
      )}
    </div>
  )
}

export default Sidebar 