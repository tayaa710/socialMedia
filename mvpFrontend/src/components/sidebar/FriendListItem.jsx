import { Message } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { OnlineUsersContext } from '../../context/OnlineUsersContext'

const FriendListItem = ({ friend, handleMessageClick }) => {
  const { onlineUsers } = useContext(OnlineUsersContext)
  
  // Convert IDs to strings for reliable comparison
  const isOnline = onlineUsers.includes(String(friend.id))
  
  return (
    <li className="sidebarFriend" key={friend.id}>
      <Link to={`/profile/${friend.id}`} className="sidebarFriendLink">
        <div className={`sidebarFriendImgContainer ${isOnline ? 'online' : ''}`}>
          <img 
            src={friend.profilePicture} 
            alt={friend.username} 
            className="sidebarFriendImg" 
          />
          {isOnline && <div className="sidebarOnlineBadge"></div>}
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
  )
}

export default FriendListItem 