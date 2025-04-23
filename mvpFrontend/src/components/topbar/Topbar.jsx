import { Search, LocalFlorist, LightbulbOutlined, Person } from "@mui/icons-material"
import './topbar.css'
import { Link } from "react-router-dom"

const Topbar = () => {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}>
          <LocalFlorist className="logoIcon" />
          <span className="logo">Verdant</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchContainer">
          <Search className="searchIcon" />
          <input 
            placeholder="Search for content..." 
            className="searchInput" 
            name="topbarSearch"
            id="topbarSearch"
          />
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
