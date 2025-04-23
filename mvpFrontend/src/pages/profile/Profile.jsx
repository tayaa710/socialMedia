import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfilePosts from '../../components/profilePosts/ProfilePosts'
import SelectionBar from '../../components/selectionBar/SelectionBar'
import Topbar from '../../components/topbar/Topbar'
import Userbar from '../../components/userbar/Userbar'
import ProfileFriends from '../../components/profileFriends/ProfileFriends'
import './profile.css'
import { useState, useMemo } from 'react'
import { Users } from '../../data/dummyData'

const Profile = () => {
  const [selectedOption, setSelectedOption] = useState("Posts")
  const user = useMemo(() => Users[Math.floor(Math.random() * Users.length)], [])
  
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
