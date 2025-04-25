import Home from "./pages/feed/Feed"
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import { initializeAuth } from "./apiCalls"
import { AuthContext } from "./context/AuthContext"

function App() {
  const { user, dispatch } = useContext(AuthContext)

  useEffect(() => {
    // Initialize authentication on app load
    initializeAuth(dispatch)
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      </Routes>
    </Router>
  )
}

export default App 