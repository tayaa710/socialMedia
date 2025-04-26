import { useEffect, useState, useContext } from "react";
import User from "../user/User";
import "./profileFriends.css";
import { Person, SortByAlpha, AccessTime, Search, LocalFlorist, ViewModule, ViewList } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const ProfileFriends = () => {
  const { user: contextUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [sortMethod, setSortMethod] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contextUser?.id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(`/api/users/${contextUser.id}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        
        setFriends(response.data.friends || []);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [contextUser]);

  const filteredFriends = () => {
    let result = [...friends];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      result = result.filter(friend =>
        friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortMethod === "alphabetical") {
      result.sort((a, b) => (a.username || "").localeCompare(b.username || ""));
    } else if (sortMethod === "recent") {
      result.sort((a, b) => (b.friendedDate || 0) - (a.friendedDate || 0));
    } else if (sortMethod === "online") {
      result.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    }

    return result;
  };

  const getDisplayUsers = () => {
    if (activeTab === "friends") {
      return filteredFriends();
    }
    // Pages and Groups will be implemented later
    return [];
  };

  if (loading) {
    return (
      <div className="friendsWrapper">
        <div className="loadingIndicator">
          <LocalFlorist className="loadingIcon" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friendsWrapper">
      <div className="friendsHeader">
        <div className="friendsTitle-wrapper">
          <Person className="friendsTitle-icon" />
          <h2 className="friendsTitle">
            {activeTab === "friends" ? "Friends" : activeTab === "pages" ? "Pages" : "Groups"}
          </h2>
          <div className="friendsStats">
            <div className="friendsStat">
              <span className="friendsStatNumber">
                {activeTab === "friends" ? friends.length : 0}
              </span>
              <span className="friendsStatLabel">Total</span>
            </div>
            <div className="friendsStat online">
              <span className="friendsStatNumber">
                {activeTab === "friends" ? friends.filter(f => f.isOnline).length : 0}
              </span>
              <span className="friendsStatLabel">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="friendsTabs">
        <button
          className={`friendsTab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={`friendsTab ${activeTab === "pages" ? "active" : ""}`}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>
        <button
          className={`friendsTab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      <div className="friendsControls">
        <div className="friendsSearch">
          <Search className="searchIcon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
            name="friendSearch"
            id="friendSearch"
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
        {activeTab !== "friends" ? (
          <div className="comingSoonMessage">
            <LocalFlorist className="comingSoonIcon" />
            <h3>{activeTab === "pages" ? "Pages" : "Groups"} Coming Soon</h3>
            <p>This feature is currently under development</p>
          </div>
        ) : getDisplayUsers().length > 0 ? (
          getDisplayUsers().map(friend => (
            <div className="friendCard" key={friend._id || friend.id}>
              <User user={friend} viewMode={viewMode} />
            </div>
          ))
        ) : (
          <div className="noFriendsMessage">
            <LocalFlorist className="noFriendsIcon" />
            <h3>No friends found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;