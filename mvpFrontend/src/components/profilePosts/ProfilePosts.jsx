import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Post from "../post/Post";
import "./profilePosts.css";
import { useState } from "react";
import { FilterAlt, LocalFlorist, Favorite, TrendingUp, CalendarToday, VerifiedUser } from "@mui/icons-material";

const ProfilePosts = () => {
  const [sortOrder, setSortOrder] = useState("Recent");

  const posts = [
    {
      user: "Aaron",
      date: "Feb 20, 2025",
      likes: 185,
      caption: "Exploring Hamilton Gardens - a space where nature and community converge in perfect harmony. #NaturalBeauty",
      url: "../../assets/postReal/1.JPG",
      verified: true,
      id: 1,
    },
    {
      user: "Aaron",
      date: "Feb 18, 2025",
      likes: 327,
      caption: "Working together at the local community garden. Sustainable food production starts at the neighborhood level!",
      url: "../../assets/postReal/2.jpeg",
      verified: true,
      id: 2,
    },
    {
      user: "Aaron",
      date: "Feb 15, 2025",
      likes: 239,
      caption: "Morning meditation by the lake. Finding inner balance helps us create outer harmony. #MindfulLiving",
      url: "../../assets/postReal/3.jpeg",
      verified: true,
      id: 3,
    },
    {
      user: "Aaron",
      date: "Feb 10, 2025",
      likes: 412,
      caption: "Workshop on digital wellbeing and the importance of authentic online relationships. Great discussions today!",
      url: "../../assets/postReal/4.jpeg",
      verified: true,
      id: 4,
    },
    {
      user: "Aaron",
      date: "Feb 5, 2025",
      likes: 293,
      caption: "Beach cleanup with friends. Every piece of plastic we remove today is one less threat to ocean life tomorrow.",
      url: "../../assets/postReal/4.jpeg",
      verified: true,
      id: 7,
    },
    {
      user: "Aaron",
      date: "Feb 1, 2025",
      likes: 201,
      caption: "Supporting local artisans at the weekend market. Ethical consumption means knowing who made your purchases.",
      url: "../../assets/postReal/4.jpeg",
      verified: true,
      id: 8,
    },
  ];

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
              {sortOrder === "Verified" && <VerifiedUser className="sortIcon" />}
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
              <option value="Verified">Verified Only</option>
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
        
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 1050: 3, 1300: 4 }}
          gutterBreakpoints={{ 350: "22px", 750: "25px", 900: "30px" }}
        >
          <Masonry className="masonry-grid">
            {[...posts]
              .sort((a, b) => {
                if (sortOrder === "Recent") return new Date(b.date) - new Date(a.date);
                if (sortOrder === "Oldest") return new Date(a.date) - new Date(b.date);
                if (sortOrder === "Popular") return b.likes - a.likes;
                if (sortOrder === "Verified") return b.verified - a.verified;
                return 0;
              })
              .map((post) => (
                <Post
                  key={post.id}
                  date={post.date}
                  likes={post.likes}
                  caption={post.caption}
                  image={post.url}
                  verified={post.verified}
                />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  )
}

export default ProfilePosts