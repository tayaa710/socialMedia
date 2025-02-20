import { Search } from "@mui/icons-material"
import './topbar.css'

export default function Topbar() {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Haggis</span>
      </div>
      <div className="topbarCenter">
        <div className="searchContainer">
          
          <input placeholder="search" className="searchInput" />
          <Search className="searchIcon" />

        </div>
      </div>
      <div className="topbarRight">

      </div>
    </div>
  )
}
