import { useEffect, useState } from "react";
import User from "../user/User";
import "./profileFriends.css";
import { People, SortByAlpha, AccessTime, LocalFlorist, FilterAlt } from "@mui/icons-material";
import { Users } from "../../data/dummyData";
const ProfileFriends = ({user}) => {

  const [friends, setFriends] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortMethod, setSortMethod] = useState("default");

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

  const friendsSorted = () => {
    if (sortMethod === "alphabetical") {
      return [...friends].sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortMethod === "recent") {
      return [...friends].sort((a, b) => b.friendedDate - a.friendedDate);
    } else {
      return friends;
    }
  };

  return (
    <div className="friendsContainer">
      <div className="friendsHeader">
        <div className="friendsTitle-wrapper">
          <People className="friendsTitle-icon" />
          <h2 className="friendsTitle">{user.username}&apos;s Community Circle</h2>
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
        
        <button 
          className={`friendsFilterButton ${filterOpen ? 'active' : ''}`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FilterAlt className="filterIcon" /> 
          <span>Filter</span>
        </button>
      </div>
      
      {filterOpen && (
        <div className="sortControls">
          <button 
            className={`sortButton ${sortMethod === "alphabetical" ? 'active' : ''}`}
            onClick={() => setSortMethod("alphabetical")}
          >
            <SortByAlpha className="sortIcon" />
            <span>Alphabetical</span>
          </button>
          <button 
            className={`sortButton ${sortMethod === "recent" ? 'active' : ''}`}
            onClick={() => setSortMethod("recent")}
          >
            <AccessTime className="sortIcon" />
            <span>Most Recent</span>
          </button>
        </div>
      )}
      
      <div className="connectionsBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <LocalFlorist className="bannerIcon" />
          <p>Meaningful connections create a more intentional digital experience.</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="friendsList">
        {friendsSorted().length > 0 ? (
          friendsSorted().map(friend => (
            <User 
              user={friend}
              key={friend.id}
            />
          ))
        ) : (
          <div className="noFriendsMessage">
            <LocalFlorist className="noFriendsIcon" />
            <p>No matching friends found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFriends;