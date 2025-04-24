import Home from "./pages/feed/Feed"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { initializeAuth } from "./apiCalls"

function App() {
  useEffect(() => {
    // Initialize authentication on app load
    initializeAuth()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App 