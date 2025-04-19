import { createRoot } from 'react-dom/client'
import Profile from './pages/profile/Profile.jsx'
import Login from './pages/login/Login.jsx'

createRoot(document.getElementById('root')).render(
    <div>
        <Login />
    </div>
)
