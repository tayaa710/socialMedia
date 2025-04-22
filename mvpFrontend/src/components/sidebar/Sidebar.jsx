import './sidebar.css'
import { RssFeed, Chat, PlayCircleFilled, Bookmark, HelpOutline } from "@mui/icons-material"

const Sidebar = () => {
  return (
    <div className="sidebarWrapper">
      <h3 className="sidebarTitle">Explore</h3>
      <ul className="sidebarList">
        <li className="sidebarItem active">
          <RssFeed className="sidebarIcon"/>
          <span className="sidebarItemText">Home</span>
        </li>
        <li className="sidebarItem">
          <Chat className="sidebarIcon"/>
          <span className="sidebarItemText">Trending</span>
        </li>
        <li className="sidebarItem">
          <PlayCircleFilled className="sidebarIcon"/>
          <span className="sidebarItemText">Discover</span>
        </li>
        <li className="sidebarItem">
          <Bookmark className="sidebarIcon"/>
          <span className="sidebarItemText">Saved</span>
        </li>
      </ul>
      <button className="sidebarButton">Show More</button>
      <hr className="sidebarHr" />
      <h3 className="sidebarTitle">Communities</h3>
      <ul className="sidebarFriendList">
        <li className="sidebarFriend">
          <span className="sidebarFriendName">Photography</span>
        </li>
        <li className="sidebarFriend">
          <span className="sidebarFriendName">Web Development</span>
        </li>
        <li className="sidebarFriend">
          <span className="sidebarFriendName">Travel</span>
        </li>
        <li className="sidebarFriend">
          <span className="sidebarFriendName">Cooking</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar 