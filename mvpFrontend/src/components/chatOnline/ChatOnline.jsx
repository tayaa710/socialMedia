import './chatOnline.css'
import { useState, useEffect } from 'react'
import { userAPI, conversationAPI } from '../../services/api'

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])

    useEffect(() => {
        const friendList = async () => {
            const res = await userAPI.getFriends(currentId)
            setFriends(res)
        }
        friendList()
    }, [currentId])
    
    useEffect(() => {
        console.log("Friends in ChatOnline:", friends)
        console.log("Online users in ChatOnline:", onlineUsers)
        
        if (Array.isArray(friends) && Array.isArray(onlineUsers)) {
            // Convert all IDs to strings for reliable comparison
            const onlineUserIds = onlineUsers.map(id => String(id));
            
            // Filter friends that are online by comparing string IDs
            const online = friends.filter(friend => {
                const friendId = String(friend.id);
                const isOnline = onlineUserIds.includes(friendId);
                console.log(`Friend ${friend.firstName || friend.username} (${friendId}): online = ${isOnline}`);
                return isOnline;
            });
            
            console.log("Online friends after filter:", online)
            setOnlineFriends(online)
        }
    }, [friends, onlineUsers])

    // Handle click on an online friend
    const handleClick = async (user) => {
        try {
            // Try to find existing conversation
            const res = await conversationAPI.getConversation(currentId, user.id)

            if (res && res.length > 0) {
                setCurrentChat(res[0])
            } else {
                // Create a new conversation if none exists
                const newConversation = await conversationAPI.createConversation({
                    senderId: currentId,
                    receiverId: user.id
                })
                setCurrentChat(newConversation)
            }
        } catch (err) {
            console.error("Error setting up conversation:", err)
        }
    }

    return (
        <div className="chatOnline">
            {onlineFriends.map((o) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o.id}>
                    <div className="chatOnlineImgContainer">
                        <img className="chatOnlineImg" src={o.profilePicture} alt="" />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{o.username}</span>
                </div>
            ))}
        </div>
    )
}

export default ChatOnline;