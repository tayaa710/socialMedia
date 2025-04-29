/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import User from "../user/User";
import "./profileFriends.css";
import { Person, SortByAlpha, AccessTime, Search, LocalFlorist, ViewModule, ViewList } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { userAPI } from "../../services/api";

// Custom event name for friend updates
const FRIEND_UPDATE_EVENT = 'friendStatusUpdated';

const ProfileFriends = ({ user: profileUser }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [sortMethod, setSortMethod] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);

  // Use profileUser if provided, otherwise fallback to currentUser
  const user = profileUser || currentUser;

  const fetchUserData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Make sure we're passing a string ID, not an object
      const userId = typeof user.id === 'object' ? user.id._id || user.id.id : user.id;
      const userData = await userAPI.getUser(userId);
      setFriends(userData.friends || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Listen for friend update events
  useEffect(() => {
    // Create event handler function
    const handleFriendUpdate = (event) => {
      // Check if this update is relevant to the current user
      if (event.detail?.userId === user?.id) {
        console.log("Friend update detected, refreshing friend list");
        fetchUserData();
      }
    };

    // Add event listener
    window.addEventListener(FRIEND_UPDATE_EVENT, handleFriendUpdate);

    // Cleanup function
    return () => {
      window.removeEventListener(FRIEND_UPDATE_EVENT, handleFriendUpdate);
    };
  }, [user]);

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
            {user.firstName || user.username}&apos;s {activeTab === "friends" ? "Friends" : activeTab === "pages" ? "Pages" : "Groups"}
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

// Export the event name for other components to use
export { FRIEND_UPDATE_EVENT };
export default ProfileFriends;