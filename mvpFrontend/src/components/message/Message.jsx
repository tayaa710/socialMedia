import './message.css'
import { format } from 'timeago.js'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userAPI } from '../../services/api'

const Message = ({message, own}) => {
    const { user: currentUser } = useContext(AuthContext)
    const [senderData, setSenderData] = useState(null)
    
    useEffect(() => {
        // Only fetch sender data if this is not the current user's message
        if (!own && message?.sender) {
            const getSenderData = async () => {
                try {
                    console.log("Fetching data for sender ID:", message.sender)
                    const userData = await userAPI.getUser(message.sender)
                    console.log("Received sender data:", userData)
                    setSenderData(userData)
                } catch (error) {
                    console.error("Failed to fetch sender data:", error)
                }
            }
            getSenderData()
        }
    }, [message?.sender, own])
    
    // If message data is invalid, show nothing
    if (!message) return null
    
    // Determine which profile picture to display
    const profilePicture = own 
        ? currentUser?.profilePicture
        : (senderData?.profilePicture || "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
    
    console.log(
        own ? "Own message profile picture:" : "Other user's profile picture:", 
        profilePicture,
        "Message:", message
    )
    
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img 
                    src={profilePicture} 
                    alt={own ? "You" : (senderData?.username || "User")} 
                    className="messageImg" 
                />
                <p className="messageText">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">
                <p className="messageTime">{format(message.createdAt)}</p>
            </div>
        </div>
    )
}

export default Message