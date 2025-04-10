import "./topbar.css"
import { Search, Person, Chat, Notifications } from "@mui/icons-material"

const Topbar = () => {
  return(
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Definitley not Facebook</span>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon"/>
          <input placeholder="Search for friends, posts or any video" className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">9</span>
          </div>
        </div>
        <img src="/assets/person/1.jpeg" alt="" className="topbarImage" />
      </div>
    </div>
  )
}

export default Topbar