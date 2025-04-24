import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfilePosts from '../../components/profilePosts/ProfilePosts'
import SelectionBar from '../../components/selectionBar/SelectionBar'
import Topbar from '../../components/topbar/Topbar'
import Userbar from '../../components/userbar/Userbar'
import ProfileFriends from '../../components/profileFriends/ProfileFriends'
import './profile.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'

const Profile = () => {
  const id = useParams().id
  const [selectedOption, setSelectedOption] = useState("Posts")
  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhcm9udGF5bG9yMjQiLCJpZCI6IjY4MDg2MzlkMTU4ZDQyZTQ5ZGJlMmY0MSIsImlhdCI6MTc0NTM4MjQ3NiwiZXhwIjoxNzQ1OTg3Mjc2fQ.AdjUi4yHqdsWjq5WZC76R93GZQibBTTNlKW3fL2ySiE'
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    };
    
    fetchUser();
  }, []);
  
  // If user not found, show an error message
  if (!user) {
    return (
      <div className='pageContainer'>
        <Topbar />
        <div className="errorContainer" style={{ 
          textAlign: 'center', 
          margin: '100px auto', 
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          maxWidth: '600px'
        }}>
          <h2>User Not Found</h2>
          <p>Sorry, the user profile you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
  
  const renderOption = () => {
    switch (selectedOption) {
      case "Posts": return <ProfilePosts user={user} />
      case "Friends": return <ProfileFriends user={user} />
      case "Info": return <ProfileInfo user={user} />
      default: return <ProfilePosts user={user} />
    }
  }

  return (
    <div className='pageContainer'>
      <div className="heading">
        <Topbar />
        <Userbar user={user} />
        <SelectionBar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </div>
      
      <div className="profileBody">
        {renderOption()}
      </div>
      
      <footer className="ethicalFooter">
        <p>Ethical Social Media • No AI-Generated Content</p>
        <p>© 2025 • <a href="#">Privacy Policy</a> • <a href="#">Content Guidelines</a> • <a href="#">Authenticity Pledge</a></p>
      </footer>
    </div>
  )
}

export default Profile
