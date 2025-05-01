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
            // Debug each friend to see its structure
            friends.forEach(friend => {
                console.log("Friend object:", friend);
                console.log("Friend id:", friend.id);
                console.log("Is online:", onlineUsers.includes(friend.id));
            });
            
            // Try matching by string comparison since MongoDB IDs might be objects
            const online = friends.filter(friend => {
                // Convert IDs to strings for comparison
                return onlineUsers.some(userId => userId === friend.id);
            });
            
            console.log("Online friends after filter:", online)
            setOnlineFriends(online)
        }
    }, [friends, onlineUsers])

    const handleClick = async (user) => {
        try {
            // First try to find an existing conversation
            const existingConversation = await conversationAPI.findConversation(currentId, user.id)
            
            if (existingConversation) {
                // If conversation exists, use it
                setCurrentChat(existingConversation)
            } else {
                // If no conversation exists, create a new one
                const newConversation = await conversationAPI.createConversation(currentId, user.id)
                setCurrentChat(newConversation)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="chatOnline">
            {onlineFriends.length > 0 ? (
                onlineFriends.map(o => (
                    <div className="chatOnlineFriend" key={o.id} onClick={() => handleClick(o)}>
                        <div className="chatOnlineImgContainer">
                            <img 
                                src={o?.profilePicture || "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"} 
                                alt="" 
                                className="chatOnlineImg" 
                            />
                            <div className="chatOnlineBadge">
                                <span className="chatOnlineBadgeIcon"></span>
                            </div>
                        </div>
                        <span className="chatOnlineName">{o.firstName} {o.lastName}</span>
                    </div>
                ))
            ) : (
                <span className="noOnlineText">No friends online</span>
            )}
        </div>
    )
}

export default ChatOnline;