import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfilePosts from '../../components/profilePosts/ProfilePosts'
import SelectionBar from '../../components/selectionBar/SelectionBar'
import Topbar from '../../components/topbar/Topbar'
import Userbar from '../../components/UserBar/Userbar'
import './profile.css'
import { useState } from 'react'

function App() {
  const [selectedOption, setSelectedOption] = useState("Posts")
  const renderOption = () => {
    switch (selectedOption){
      case "Posts": {return <ProfilePosts/>}

      case "Friends": {return <></>}

      case "Info": {return <ProfileInfo/>}
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

    </div>

  )
}

export default App
