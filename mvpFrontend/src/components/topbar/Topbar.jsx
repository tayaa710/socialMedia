import { Search, LocalFlorist, LightbulbOutlined, Person } from "@mui/icons-material"
import './topbar.css'

const Topbar = () => {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <LocalFlorist className="logoIcon" />
        <span className="logo">Verdant</span>
      </div>
      <div className="topbarCenter">
        <div className="searchContainer">
          <Search className="searchIcon" />
          <input placeholder="Search for content..." className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <LightbulbOutlined />
          </div>
          <div className="topbarIconItem">
            <Person />
          </div>
          <div className="topbarIconItem">
            <img src="../../assets/person/profile.jpeg" alt="" className="topbarImg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
