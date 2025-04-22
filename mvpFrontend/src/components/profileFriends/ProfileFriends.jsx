import User from "../user/User";
import "./profileFriends.css";
import { useState, useEffect } from "react";
import { People, SortByAlpha, AccessTime, LocalFlorist, FilterAlt } from "@mui/icons-material";
import { getUserByUsername } from "../../utils/userDataUtils";

const ProfileFriends = ({ username = "Aaron" }) => {
  const [sortOrder, setSortOrder] = useState("Recent");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [friends, setFriends] = useState([]);
  const [userFullName, setUserFullName] = useState("");
  
  useEffect(() => {
    // Get user info for display name
    const userData = getUserByUsername(username);
    if (userData) {
      setUserFullName(`${userData.firstName} ${userData.lastName}`);
    } else {
      setUserFullName(username);
    }
    
    // In a real app, this would fetch friends based on the username from an API
    // For this MVP, we're using sample data
    
    const defaultFriends = [
      { id: 101, name: "Emma Thompson", friendedDate: "2023-11-15", interests: ["Sustainable Living", "Organic Gardening"], isOnline: true, mutualConnections: 143 },
      { id: 102, name: "Michael Chen", friendedDate: "2022-08-22", interests: ["Renewable Energy", "Community Building"], isOnline: false, mutualConnections: 87 },
      { id: 103, name: "Sophia Rodriguez", friendedDate: "2024-01-30", interests: ["Digital Minimalism", "Ethical Tech"], isOnline: true, mutualConnections: 215 },
      { id: 104, name: "Jamal Williams", friendedDate: "2023-04-17", interests: ["Zero Waste", "Local Food Systems"], isOnline: false, mutualConnections: 112 },
      { id: 105, name: "Olivia Kim", friendedDate: "2021-12-08", interests: ["Mindfulness", "Sustainable Fashion"], isOnline: false, mutualConnections: 76 },
      { id: 106, name: "Daniel Martinez", friendedDate: "2022-05-14", interests: ["Urban Farming", "Environmental Education"], isOnline: true, mutualConnections: 156 },
      { id: 107, name: "Aisha Patel", friendedDate: "2023-09-02", interests: ["Ecological Conservation", "Vegetarian Cooking"], isOnline: false, mutualConnections: 134 },
      { id: 108, name: "Noah Johnson", friendedDate: "2022-10-19", interests: ["Climate Action", "Minimalism"], isOnline: true, mutualConnections: 91 },
      { id: 109, name: "Zoe Wilson", friendedDate: "2023-07-25", interests: ["Eco-friendly Travel", "Nature Photography"], isOnline: false, mutualConnections: 67 },
      { id: 110, name: "Benjamin Taylor", friendedDate: "2021-06-11", interests: ["Sustainable Architecture", "Hiking"], isOnline: true, mutualConnections: 182 },
      { id: 111, name: "Leila Hassan", friendedDate: "2022-03-08", interests: ["Ocean Conservation", "Marine Biology"], isOnline: false, mutualConnections: 95 },
      { id: 112, name: "Gabriel Morales", friendedDate: "2023-01-14", interests: ["Permaculture", "Community Gardens"], isOnline: true, mutualConnections: 124 },
      { id: 113, name: "Harper Lee", friendedDate: "2022-11-30", interests: ["Ethical Investing", "Solar Energy"], isOnline: false, mutualConnections: 73 },
      { id: 114, name: "Samuel Nguyen", friendedDate: "2023-08-05", interests: ["Sustainable Transportation", "Cycling"], isOnline: true, mutualConnections: 158 },
      { id: 115, name: "Isabella Clark", friendedDate: "2021-09-17", interests: ["Vegan Cooking", "Animal Rights"], isOnline: false, mutualConnections: 110 },
      { id: 116, name: "Elijah Walker", friendedDate: "2024-02-12", interests: ["Green Tech", "Regenerative Agriculture"], isOnline: true, mutualConnections: 89 },
      { id: 117, name: "Maya Anderson", friendedDate: "2023-05-29", interests: ["Eco Art", "Upcycling"], isOnline: false, mutualConnections: 137 },
      { id: 118, name: "Lucas Wright", friendedDate: "2022-07-03", interests: ["Waste Reduction", "Composting"], isOnline: true, mutualConnections: 103 },
      { id: 119, name: "Avery Scott", friendedDate: "2023-10-21", interests: ["Sustainable Forestry", "Bird Watching"], isOnline: false, mutualConnections: 82 },
      { id: 120, name: "Chloe Robinson", friendedDate: "2022-02-14", interests: ["Plant-Based Diet", "Holistic Health"], isOnline: true, mutualConnections: 171 }
    ];

    // Generate friends based on sample user data
    const generateFriendsFromSampleUsers = () => {
      // Take a subset of the sample users as friends
      // In a real app, this would be based on actual friend connections
      const sampleUsernames = ["Emily", "Michael", "Sophia", "Jamal", "Olivia"];
      const randomFriends = sampleUsernames.map(friendUsername => {
        const friendData = getUserByUsername(friendUsername);
        if (!friendData) return null;
        
        // Generate random dates within the last year
        const now = new Date();
        const randomMonths = Math.floor(Math.random() * 12);
        const friendedDate = new Date(now);
        friendedDate.setMonth(now.getMonth() - randomMonths);
        
        return {
          id: parseInt(friendData.id),
          name: `${friendData.firstName} ${friendData.lastName}`,
          friendedDate: friendedDate.toISOString().split('T')[0],
          interests: friendData.valuesAndInterests?.slice(0, 2) || [],
          isOnline: Math.random() > 0.5, // Randomly online or offline
          mutualConnections: Math.floor(Math.random() * 150) + 20 // Random mutual connections
        };
      }).filter(Boolean); // Remove any null entries
      
      return randomFriends;
    };

    if (username === "Aaron") {
      setFriends(defaultFriends);
    } else {
      // For other users, generate a smaller friend list
      setFriends(generateFriendsFromSampleUsers());
    }
  }, [username]);
  
  // Calculate online friends count
  const onlineFriendsCount = friends.filter(friend => friend.isOnline).length;

  const friendsSorted = () => {
    let filtered = [...friends];
    
    // Apply online filter if selected
    if (onlineOnly) {
      filtered = filtered.filter(friend => friend.isOnline);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sort
    switch (sortOrder) {
      case "A-Z": {
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      case "Z-A": {
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      case "Recent": {
        return filtered.sort((a, b) => new Date(b.friendedDate) - new Date(a.friendedDate));
      }

      case "Oldest": {
        return filtered.sort((a, b) => new Date(a.friendedDate) - new Date(b.friendedDate));
      }

      default: {
        return filtered.sort((a, b) => new Date(b.friendedDate) - new Date(a.friendedDate));
      }
    }
  };

  return (
    <div className="friendsContainer">
      <div className="friendsHeader">
        <div className="friendsTitle-wrapper">
          <People className="friendsTitle-icon" />
          <h2 className="friendsTitle">{userFullName}'s Community Circle</h2>
          <div className="friendsStats">
            <div className="friendsStat">
              <span className="friendsStatNumber">{friends.length}</span>
              <span className="friendsStatLabel">Total</span>
            </div>
            <div className="friendsStat online">
              <span className="friendsStatNumber">{onlineFriendsCount}</span>
              <span className="friendsStatLabel">Online</span>
            </div>
          </div>
        </div>
        
        <div className="friendsActions">
          <div className="searchWrapper">
            <input 
              type="text" 
              className="friendSearchInput" 
              placeholder="Search friends or interests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sortWrapper">
            <div className="sortIconContainer">
              {sortOrder === "Recent" || sortOrder === "Oldest" ? <AccessTime className="sortIcon" /> : <SortByAlpha className="sortIcon" />}
            </div>
            <select 
              className="friendsSortSelect" 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="Recent">Recently Connected</option>
              <option value="Oldest">Longest Connections</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>
          
          <button 
            className={`friendsFilterButton ${filterOpen ? 'active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FilterAlt className="filterIcon" /> 
            <span>Filter</span>
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="friendsFilterPanel">
          <div className="filterGroup">
            <h4>Status</h4>
            <div className="filterOptions">
              <div className="filterChip">
                <input 
                  type="checkbox" 
                  id="online-only" 
                  checked={onlineOnly}
                  onChange={() => setOnlineOnly(!onlineOnly)}
                />
                <label htmlFor="online-only">Online Only</label>
              </div>
            </div>
          </div>
          
          <div className="filterGroup">
            <h4>Interests</h4>
            <div className="filterOptions">
              <div className="filterChip">
                <input type="checkbox" id="sustainability" />
                <label htmlFor="sustainability">Sustainability</label>
              </div>
              <div className="filterChip">
                <input type="checkbox" id="ethics" />
                <label htmlFor="ethics">Ethics</label>
              </div>
              <div className="filterChip">
                <input type="checkbox" id="community" />
                <label htmlFor="community">Community</label>
              </div>
              <div className="filterChip">
                <input type="checkbox" id="mindfulness" />
                <label htmlFor="mindfulness">Mindfulness</label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="friendsConnectionsBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <LocalFlorist className="connectionIcon" />
          <p>Your authentic connections form the foundation of a meaningful digital experience.</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="friendsGrid">
        <div className="community-decoration top-right"></div>
        <div className="community-decoration bottom-left"></div>
        
        {friendsSorted().length === 0 ? (
          <div className="noFriendsResult">
            <p>No friends match your search criteria</p>
          </div>
        ) : (
          <div className="friends-grid-layout">
            {friendsSorted().map((friend) => (
              <User 
                key={friend.id} 
                id={friend.id}
                name={friend.name} 
                interests={friend.interests}
                friendDate={new Date(friend.friendedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
                isOnline={friend.isOnline}
                mutualConnections={friend.mutualConnections}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileFriends