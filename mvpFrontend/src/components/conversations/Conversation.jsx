import './conversation.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userAPI } from '../../services/api'

const Conversation = ({ conversation }) => {
    const [user, setUser] = useState(null)
    const { user: currentUser } = useContext(AuthContext)

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentUser.id)

        const getUser = async () => {
            try {
                const userData = await userAPI.getUser(friendId)
                setUser(userData)
            } catch (error) {
                console.error("Failed to get user data:", error)
            }
        }
        getUser()
    }, [conversation, currentUser])

    return (
        <div className="conversation">
            <img
                src={user?.profilePicture || "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
                alt=""
                className="conversationImg"
            />
            <span className="conversationName">{user?.username || 'Loading...'}</span>
        </div>
    )
}

export default Conversation