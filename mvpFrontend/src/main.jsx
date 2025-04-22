import { createRoot } from 'react-dom/client'
import Profile from './pages/profile/Profile.jsx'
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import Feed from './pages/feed/Feed.jsx'
import UserList from './components/userList/UserList.jsx'
import {
    BrowserRouter as Router,
    Routes, Route, Link
  } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
   <Router>
    <div>
        <Link to="/profile/Aaron">Profile</Link>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/users">Users</Link>
    </div>
    <Routes>
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
    </Routes>
   </Router>
)
