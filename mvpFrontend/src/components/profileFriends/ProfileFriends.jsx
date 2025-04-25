import { useEffect, useState, useContext } from "react";
import User from "../user/User";
import "./profileFriends.css";
import { Person, SortByAlpha, AccessTime, Search, LocalFlorist, ViewModule, ViewList } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const ProfileFriends = ({ user }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [sortMethod, setSortMethod] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("following");

  useEffect(() => {
    setFollowers(user ? user.followers : currentUser.followers)
    setFollowing(user ? user.following : currentUser.following)
  }, [user, currentUser])

  const filteredFriends = () => {
    let result = activeTab === "followers" ? [...followers] : [...following];

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

  const getDisplayUsers = () => {
    return filteredFriends();
  };

  return (
    <div className="friendsWrapper">
      <div className="friendsHeader">
        <div className="friendsTitle-wrapper">
          <Person className="friendsTitle-icon" />
          <h2 className="friendsTitle">
            {activeTab === "followers" ? "Followers" : "Following"}
          </h2>
          <div className="friendsStats">
            <div className="friendsStat">
              <span className="friendsStatNumber">
                {activeTab === "followers" ? followers.length : following.length}
              </span>
              <span className="friendsStatLabel">Total</span>
            </div>
            <div className="friendsStat online">
              <span className="friendsStatNumber">
                {activeTab === "followers"
                  ? followers.filter(f => f.isOnline).length
                  : following.filter(f => f.isOnline).length}
              </span>
              <span className="friendsStatLabel">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="friendsTabs">
        <button
          className={`friendsTab ${activeTab === "following" ? "active" : ""}`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button
          className={`friendsTab ${activeTab === "followers" ? "active" : ""}`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
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
        {getDisplayUsers().length > 0 ? (
          getDisplayUsers().map(user => (
            <div className="friendCard" key={user._id || user.id}>
              <User user={user} viewMode={viewMode} />
            </div>
          ))
        ) : (
          <div className="noFriendsMessage">
            <LocalFlorist className="noFriendsIcon" />
            <h3>No {activeTab} found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;