import { LocalFlorist, LightbulbOutlined, Person } from "@mui/icons-material"
import './topbar.css'
import { Link } from "react-router-dom"
import { useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

const Topbar = () => {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality here
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', outline: 'none' }}>
          <LocalFlorist className="logoIcon" />
          <span className="logo">Authentra</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <form className="searchContainer" onSubmit={handleSearch}>
          <input 
            placeholder="Search for content..." 
            className="searchInput" 
            name="topbarSearch"
            id="topbarSearch"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="searchButton">Search</button>
        </form>
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
            {user ? (
              <Link to={`/profile/${user.id}`}>
                <img src={user.profilePicture} alt="" className="topbarImg" />
              </Link>
            ) : (
              <Link to="/login">
                <Person className="topbarImg" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
