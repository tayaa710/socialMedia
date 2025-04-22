import Post from "../post/Post";
import "./profilePosts.css";
import { useState, useEffect } from "react";
import { FilterAlt, LocalFlorist, Favorite, TrendingUp, CalendarToday, ExpandMore } from "@mui/icons-material";

const ProfilePosts = ({ username = "Aaron" }) => {
  const [sortOrder, setSortOrder] = useState("Recent");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userFullName, setUserFullName] = useState("");

  // Fetch posts based on username
  useEffect(() => {
    // Set username as display name (without getUserByUsername)
    setUserFullName(username);

    // In a real app, this would fetch posts from an API
    // For this MVP, we're using sample data

    // Sample local posts data for Aaron
    const aaronPosts = [
      {
        userId: "Aaron",
        date: "Feb 20, 2025",
        likes: 185,
        description: "Exploring Hamilton Gardens - a space where nature and community converge in perfect harmony. #NaturalBeauty",
        img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
        id: 1,
      },
      {
        userId: "Aaron",
        date: "Feb 18, 2025",
        likes: 327,
        description: "Working together at the local community garden. Sustainable food production starts at the neighborhood level!",
        img: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2091&q=80",
        id: 2,
      },
      {
        userId: "Aaron",
        date: "Feb 15, 2025",
        likes: 239,
        description: "Morning meditation by the lake. Finding inner balance helps us create outer harmony. #MindfulLiving",
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80",
        id: 3,
      },
      {
        userId: "Aaron",
        date: "Feb 10, 2025",
        likes: 412,
        description: "Workshop on digital wellbeing and the importance of authentic online relationships. Great discussions today!",
        img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 4,
      },
      {
        userId: "Aaron",
        date: "Feb 5, 2025",
        likes: 293,
        description: "Beach cleanup with friends. Every piece of plastic we remove today is one less threat to ocean life tomorrow.",
        img: "https://images.unsplash.com/photo-1618477462146-050d2797431c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 7,
      },
      {
        userId: "Aaron",
        date: "Feb 1, 2025",
        likes: 201,
        description: "Supporting local artisans at the weekend market. Ethical consumption means knowing who made your purchases.",
        img: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 8,
      },
      {
        userId: "Aaron",
        date: "Jan 28, 2025",
        likes: 256,
        description: "Urban farming workshop - learning how to grow food sustainably in city environments.",
        img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 9,
      },
      {
        userId: "Aaron",
        date: "Jan 22, 2025",
        likes: 318,
        description: "Discussing the intersection of technology and environmental stewardship at the local tech meetup.",
        img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 10,
      },
      {
        userId: "Aaron",
        date: "Jan 15, 2025",
        likes: 275,
        description: "Forest restoration project completed! So rewarding to see native trees taking root again in this area.",
        img: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        id: 11,
      },
    ];

    // Generate default posts for non-Aaron users
    const generateDefaultPosts = () => {
      const templates = [
        {
          template: "Exploring sustainable solutions in my community. Every small choice makes a difference!",
          imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
          date: "Feb 22, 2025",
        },
        {
          template: "Attended a workshop on sustainability today. So inspired by the community's commitment.",
          imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
          date: "Feb 12, 2025",
        },
        {
          template: "Working with local organizations to promote environmental awareness. Together we can create positive change.",
          imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
          date: "Feb 5, 2025",
        },
        {
          template: "Beautiful day outdoors. Grateful for these moments of connection with nature.",
          imageUrl: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a",
          date: "Jan 25, 2025",
        }
      ];
      
      return templates.map((template, index) => {
        return {
          userId: username,
          date: template.date,
          likes: Math.floor(Math.random() * 300) + 100, // Random likes between 100-400
          description: template.template,
          img: template.imageUrl,
          id: index + 1
        };
      });
    };

    // Get posts based on username
    if (username === "Aaron") {
      setPosts(aaronPosts);
    } else {
      // Generate default posts for other users
      setPosts(generateDefaultPosts());
    }
  }, [username]);

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
          <h2 className="postsTitle">{userFullName}'s Posts</h2>
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
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <div className="profile-post-item" key={post.id}>
                <Post post={post} />
              </div>
            ))
          ) : (
            <div className="no-posts-message">
              <LocalFlorist className="no-posts-icon" />
              <p>No posts to display</p>
            </div>
          )}
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
                  <span>Show More</span>
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

export default ProfilePosts;