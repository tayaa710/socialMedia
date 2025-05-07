import Home from "./pages/feed/Feed"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useContext, useState } from "react"
import { initializeAuth } from "./apiCalls"
import { AuthContext } from "./context/AuthContext"
import Messenger from "./pages/messenger/Messenger"
import "./app.css"
import { OnlineUsersContext } from "./context/OnlineUsersContext"
function App() {
  const { user, dispatch } = useContext(AuthContext)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const { onlineUsers } = useContext(OnlineUsersContext)
  console.log("Online users:", onlineUsers)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await initializeAuth(dispatch)
      } finally {
        setIsAuthLoading(false)
      }
    }
    
    verifyAuth()
  }, [dispatch])

  // Don't render routes until authentication status is determined
  if (isAuthLoading) {
    return (
      <div className="authLoadingContainer">
        <div className="authLoadingSpinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/profile/:id" element={user ? <Profile /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/messenger" element={user ? <Messenger /> : <Login />} />
      </Routes>
    </Router>
  )
}

export default App 