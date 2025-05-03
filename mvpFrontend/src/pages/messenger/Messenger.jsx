import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { conversationAPI, messageAPI } from '../../services/api'
import { io } from "socket.io-client"

const Messenger = () => {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef()

  const scrollRef = useRef()

  const { user } = useContext(AuthContext)

  useEffect(() => {
    // Use environment variable for socket URL, fallback to localhost for development
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "ws://localhost:8900"
    socket.current = io(socketUrl)
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages(prev => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", user.id)
    socket.current.on("getUsers", users => {
      console.log("Socket users:", users)
      console.log("User friends:", user.friends)
      
      // Check if user.friends exists and is an array
      if (Array.isArray(user.friends) && user.friends.length > 0) {
        // Extract just the user IDs from the socket users array
        const socketUserIds = users.map(u => u.userId);
        
        // For each friend in user.friends, check if their ID is in the online users array
        // This assumes user.friends contains the full user objects, not just IDs
        let onlineFriendIds;
        
        // Check if user.friends contains objects or just IDs
        if (typeof user.friends[0] === 'object') {
          // Friends are objects, extract their IDs for online filtering
          onlineFriendIds = user.friends
            .filter(friend => socketUserIds.includes(friend.id))
            .map(friend => friend.id);
        } else {
          // Friends are already IDs, filter them directly
          onlineFriendIds = user.friends.filter(friendId => 
            socketUserIds.includes(friendId)
          );
        }
        
        console.log("Online friend IDs after filtering:", onlineFriendIds);
        setOnlineUsers(onlineFriendIds);
      } else {
        console.error("User friends is not an array or is empty:", user.friends);
        setOnlineUsers([]);
      }
    })
  }, [user])

  // Fetch conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await conversationAPI.getUserConversations(user.id)
        setConversations(data)
      } catch (err) {
        console.error("Failed to fetch conversations:", err)
      }
    }
    if (user?.id) {
      getConversations()
    }
  }, [user])

  //Fetch Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log(currentChat)
        const res = await messageAPI.getMessages(currentChat.id)
        console.log(res)
        setMessages(res)
      } catch (err) {
        console.error("Failed to fetch messages:", err)
      }
    }
    if (currentChat) {
      getMessages()
    }
  }, [currentChat])

  //Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const messageData = {
      conversationId: currentChat.id,
      sender: user.id,
      text: newMessage
    }

    const recieverId = currentChat.members.find(member => member !== user.id)

    socket.current.emit("sendMessage", {
      senderId: user.id,
      recieverId,
      text: newMessage
    })
    try {
      const res = await messageAPI.sendMessage(messageData)
      setMessages([...messages, res])
      setNewMessage("")
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input type="text" placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => {
                setCurrentChat(c)
              }} key={c.id}>
                <Conversation conversation={c} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {
              currentChat ?
                <>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div ref={scrollRef} key={m.id}>
                        <Message message={m} own={m.sender === user.id} />
                      </div>
                    ))}

                  </div>
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="message..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    />
                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                  </div></> : <span className="noConversationText">Open a conversation to start chatting</span>}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline onlineUsers={onlineUsers} currentId={user.id} setCurrentChat={setCurrentChat} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger    