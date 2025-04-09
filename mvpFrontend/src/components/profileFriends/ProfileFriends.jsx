import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import User from "../user/User";
import "./profileFriends.css";
import { useState } from "react";
import { People, SortByAlpha, AccessTime, LocalFlorist, FilterAlt } from "@mui/icons-material";

export default function ProfileFriends() {
  const [sortOrder, setSortOrder] = useState("Recent");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const friends = [
    { id: 100, name: "Daffy Duck", friendedDate: "2021-08-09", interests: ["Sustainability", "Gardening"] },
    { id: 101, name: "Bob", friendedDate: "2020-02-19", interests: ["Local Food", "Community"] },
    { id: 102, name: "Charlie", friendedDate: "2023-12-27", interests: ["Conservation", "Hiking"] },
    { id: 103, name: "David", friendedDate: "2021-01-06", interests: ["Digital Ethics", "Mindfulness"] },
    { id: 104, name: "Frank", friendedDate: "2023-06-30", interests: ["Ethical Tech", "Philosophy"] },
    { id: 105, name: "Grace", friendedDate: "2023-07-06", interests: ["Ocean Conservation", "Art"] },
    { id: 106, name: "Haggis", friendedDate: "2022-02-28", interests: ["Animal Rights", "Vegan Cooking"] },
    { id: 107, name: "Alice", friendedDate: "2021-01-21", interests: ["Climate Action", "Cycling"] },
    { id: 108, name: "Haggis", friendedDate: "2020-01-21", interests: ["Zero Waste", "DIY"] },
    { id: 109, name: "George", friendedDate: "2021-12-12", interests: ["Permaculture", "Music"] },
    { id: 110, name: "Ivy", friendedDate: "2020-03-25", interests: ["Renewable Energy", "Reading"] },
    { id: 111, name: "Jack", friendedDate: "2022-06-09", interests: ["Mindfulness", "Yoga"] },
    { id: 112, name: "Karen", friendedDate: "2024-01-10", interests: ["Ethical Fashion", "Photography"] },
    { id: 113, name: "Liam", friendedDate: "2021-05-22", interests: ["Community Gardens", "Hiking"] },
  ];

  const friendsSorted = () => {
    let filtered = [...friends];
    
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
          <h2 className="friendsTitle">Your Community Circle</h2>
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
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 300: 2, 600: 3, 900: 4, 1200: 5 }}
            gutterBreakpoints={{ 350: "15px", 750: "20px", 800: "25px" }}
          >
            <Masonry className="friends-masonry">
              {friendsSorted().map((friend) => (
                <User 
                  key={friend.id} 
                  name={friend.name} 
                  interests={friend.interests}
                  friendDate={new Date(friend.friendedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
    </div>
  );
}