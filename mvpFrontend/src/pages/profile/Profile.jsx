import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfilePosts from '../../components/profilePosts/ProfilePosts'
import SelectionBar from '../../components/selectionBar/SelectionBar'
import Topbar from '../../components/topbar/Topbar'
import Userbar from '../../components/userbar/Userbar'
import ProfileFriends from '../../components/profileFriends/ProfileFriends'
import './profile.css'
import { useState } from 'react'
import { LocalFlorist } from '@mui/icons-material'

function Profile() {
  const [selectedOption, setSelectedOption] = useState("Posts")
  
  const renderOption = () => {
    switch (selectedOption) {
      case "Posts": return <ProfilePosts />
      case "Friends": return <ProfileFriends />
      case "Info": return <ProfileInfo />
      default: return <ProfilePosts />
    }
  }

  return (
    <div className='pageContainer'>
      <div className="heading">
        <Topbar />
        <Userbar />
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
