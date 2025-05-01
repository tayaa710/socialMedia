import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { conversationAPI, messageAPI } from '../../services/api'

const Messenger = () => {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef()


  const { user } = useContext(AuthContext)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const messageData = {
      conversationId: currentChat.id,
      sender: user.id,
      text: newMessage
    }
    try {
      const res = await messageAPI.sendMessage(messageData)
      setMessages([...messages, res])
      setNewMessage("")
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
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
                        <Message  message={m} own={m.sender === user.id} />
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
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger    