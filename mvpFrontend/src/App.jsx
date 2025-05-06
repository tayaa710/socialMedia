import Home from "./pages/feed/Feed"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useContext, useState } from "react"
import { initializeAuth } from "./apiCalls"
import { AuthContext } from "./context/AuthContext"
import Messenger from "./pages/messenger/Messenger"

function App() {
  const { user, dispatch } = useContext(AuthContext)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    // Initialize authentication on app load
    const verifyAuth = async () => {
      await initializeAuth(dispatch)
      setIsAuthLoading(false)
    }
    
    verifyAuth()
  }, [dispatch])

  // Show nothing while checking authentication
  if (isAuthLoading) {
    return null // This prevents the login flash
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