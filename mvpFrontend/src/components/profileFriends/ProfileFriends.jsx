import { useEffect, useState } from "react";
import User from "../user/User";
import "./profileFriends.css";
import { Person, SortByAlpha, AccessTime, Search, LocalFlorist, ViewModule, ViewList } from "@mui/icons-material";
import { Users } from "../../data/dummyData";

const ProfileFriends = ({user}) => {
  const [friends, setFriends] = useState([]);
  const [sortMethod, setSortMethod] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const userFriends = user.friends.map(friend => {
      const friendData = Users.find(u => u.id === friend);
      return {
        ...friendData,
        isOnline: Math.random() > 0.7,
        friendedDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        mutualConnections: Math.floor(Math.random() * 10),
        interests: ["photography", "travel", "music", "cooking", "hiking"].slice(0, Math.floor(Math.random() * 4) + 1)
      };
    });
    setFriends(userFriends);
  }, [user]);

  const filteredFriends = () => {
    let result = [...friends];
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      result = result.filter(friend => 
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortMethod === "alphabetical") {
      result.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortMethod === "recent") {
      result.sort((a, b) => b.friendedDate - a.friendedDate);
    } else if (sortMethod === "online") {
      result.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    }
    
    return result;
  };

  return (
    <div className="friendsWrapper">
      <div className="friendsHeader">
        <div className="friendsTitle-wrapper">
          <Person className="friendsTitle-icon" />
          <h2 className="friendsTitle">Connections</h2>
          <div className="friendsStats">
            <div className="friendsStat">
              <span className="friendsStatNumber">{friends.length}</span>
              <span className="friendsStatLabel">Total</span>
            </div>
            <div className="friendsStat online">
              <span className="friendsStatNumber">{friends.filter(f => f.isOnline).length}</span>
              <span className="friendsStatLabel">Online</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="friendsControls">
        <div className="friendsSearch">
          <Search className="searchIcon" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
        </div>
        
        <div className="sortControls">
          <div className="sortButtons">
            <button 
              className={`sortButton ${sortMethod === "default" ? 'active' : ''}`}
              onClick={() => setSortMethod("default")}
            >
              <LocalFlorist className="sortIcon" />
              <span>Default</span>
            </button>
            <button 
              className={`sortButton ${sortMethod === "alphabetical" ? 'active' : ''}`}
              onClick={() => setSortMethod("alphabetical")}
            >
              <SortByAlpha className="sortIcon" />
              <span>A-Z</span>
            </button>
            <button 
              className={`sortButton ${sortMethod === "recent" ? 'active' : ''}`}
              onClick={() => setSortMethod("recent")}
            >
              <AccessTime className="sortIcon" />
              <span>Recent</span>
            </button>
            <button 
              className={`sortButton ${sortMethod === "online" ? 'active' : ''}`}
              onClick={() => setSortMethod("online")}
            >
              <span className="onlineDot"></span>
              <span>Online</span>
            </button>
          </div>
          
          <div className="viewModeToggle">
            <button 
              className={`viewModeButton ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <ViewModule />
            </button>
            <button 
              className={`viewModeButton ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ViewList />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`friendsList ${viewMode}`}>
        {filteredFriends().length > 0 ? (
          filteredFriends().map(friend => (
            <div className="friendCard" key={friend.id}>
              <User user={friend} />
            </div>
          ))
        ) : (
          <div className="noFriendsMessage">
            <LocalFlorist className="noFriendsIcon" />
            <h3>No connections found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;