import Post from "../post/Post";
import "./profilePosts.css";
import { useState, useEffect } from "react";
import { FilterAlt, LocalFlorist, Favorite, TrendingUp, CalendarToday, ExpandMore } from "@mui/icons-material";

const ProfilePosts = () => {
  const [sortOrder, setSortOrder] = useState("Recent");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Sample local posts data
  const posts = [
    {
      user: "Aaron",
      date: "Feb 20, 2025",
      likes: 185,
      caption: "Exploring Hamilton Gardens - a space where nature and community converge in perfect harmony. #NaturalBeauty",
      url: "../../assets/postReal/1.JPG",
      id: 1,
    },
    {
      user: "Aaron",
      date: "Feb 18, 2025",
      likes: 327,
      caption: "Working together at the local community garden. Sustainable food production starts at the neighborhood level!",
      url: "../../assets/postReal/2.jpeg",
      id: 2,
    },
    {
      user: "Aaron",
      date: "Feb 15, 2025",
      likes: 239,
      caption: "Morning meditation by the lake. Finding inner balance helps us create outer harmony. #MindfulLiving",
      url: "../../assets/postReal/3.jpeg",
      id: 3,
    },
    {
      user: "Aaron",
      date: "Feb 10, 2025",
      likes: 412,
      caption: "Workshop on digital wellbeing and the importance of authentic online relationships. Great discussions today!",
      url: "../../assets/postReal/4.jpeg",
      id: 4,
    },
    {
      user: "Aaron",
      date: "Feb 5, 2025",
      likes: 293,
      caption: "Beach cleanup with friends. Every piece of plastic we remove today is one less threat to ocean life tomorrow.",
      url: "https://images.unsplash.com/photo-1618477462146-050d2797431c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      id: 7,
    },
    {
      user: "Aaron",
      date: "Feb 1, 2025",
      likes: 201,
      caption: "Supporting local artisans at the weekend market. Ethical consumption means knowing who made your purchases.",
      url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      id: 8,
    },
    {
      user: "Aaron",
      date: "Jan 28, 2025",
      likes: 256,
      caption: "Urban farming workshop - learning how to grow food sustainably in city environments.",
      url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      id: 9,
    },
    {
      user: "Aaron",
      date: "Jan 22, 2025",
      likes: 318,
      caption: "Discussing the intersection of technology and environmental stewardship at the local tech meetup.",
      url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      id: 10,
    },
    {
      user: "Aaron",
      date: "Jan 15, 2025",
      likes: 275,
      caption: "Forest restoration project completed! So rewarding to see native trees taking root again in this area.",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      id: 11,
    },
  ];

  const handleShowMore = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setVisiblePosts(prev => prev + 3);
      setIsLoading(false);
    }, 600);
  };

  // Sort the posts based on the selected sort order
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "Recent") return new Date(b.date) - new Date(a.date);
    if (sortOrder === "Oldest") return new Date(a.date) - new Date(b.date);
    if (sortOrder === "Popular") return b.likes - a.likes;
    return 0;
  }).slice(0, visiblePosts);

  return (
    <div className="postsContainer">
      <div className="postsHeader">
        <div className="postsTitle-wrapper">
          <LocalFlorist className="postsTitle-icon" />
          <h2 className="postsTitle">Users Posts</h2>
        </div>
        
        <div className="filterControls">
          <div className="sortControl">
            <div className="sortIconContainer">
              {sortOrder === "Recent" && <CalendarToday className="sortIcon" />}
              {sortOrder === "Oldest" && <CalendarToday className="sortIcon" />}
              {sortOrder === "Popular" && <Favorite className="sortIcon" />}
            </div>
            <select 
              name="orderSelector" 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              className="sortSelector"
            >
              <option value="Recent">Most Recent</option>
              <option value="Oldest">Oldest First</option>
              <option value="Popular">Most Valuable</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="postVerificationBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <LocalFlorist className="verificationIcon" />
          <p>This space is cultivated with care. Content is reviewed to ensure authenticity and meaningful connection.</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="postsGridContainer">
        <div className="leaf-decoration top-left"></div>
        <div className="leaf-decoration bottom-right"></div>
        
        <div className="posts-grid">
          {sortedPosts.map((post) => (
            <div className="profile-post-item" key={post.id}>
              <Post
                date={post.date}
                likes={post.likes}
                caption={post.caption}
                image={post.url}
                user={post.user}
              />
            </div>
          ))}
        </div>
        
        {visiblePosts < posts.length && (
          <div className="show-more-container">
            <button 
              className={`show-more-btn ${isLoading ? 'loading' : ''}`} 
              onClick={handleShowMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>Show More Posts</span>
                  <ExpandMore className="expand-icon" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePosts