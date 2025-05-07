import './sidebar.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userAPI } from '../../services/api'
import FriendListItem from './FriendListItem'

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
        const userId = typeof user.id === 'object' ? user.id.id : user.id
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
            <FriendListItem 
              key={friend.id}
              friend={friend}
              handleMessageClick={handleMessageClick}
            />
          ))}
        </ul>
      ) : (
        <div className="sidebarNoFriends">
          <p>No friends yet</p>
          <p className="sidebarNoFriendsSubtext">Connect with others to see them here!</p>
        </div>
      )}
    </div>
  )
}

export default Sidebar 