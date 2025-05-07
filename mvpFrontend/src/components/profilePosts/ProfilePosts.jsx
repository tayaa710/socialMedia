/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import "./profilePosts.css";
import { LocalFlorist, AccessTime, Favorite, Grid3x3 } from "@mui/icons-material";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ProfilePosts = ({user}) => {
  const { user: currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts/user/${user ? user.id : currentUser.id}`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  fetchPosts();
}, [user, currentUser.id]);
  

  const sortedPosts = () => {
    if (sortMethod === "popular") {
      return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    } else if (sortMethod === "recent") {
      return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return posts;
  };

  // Only separate text posts in grid view
  const textOnlyPosts = viewMode === 'grid' ? sortedPosts().filter(post => !post.photo) : [];
  const photoPosts = viewMode === 'grid' ? sortedPosts().filter(post => post.photo) : sortedPosts();

  return (
    <div className="profilePostsContainer">
      <div className="profilePostsHeader">
        <div className="postsTitle-wrapper">
          <LocalFlorist className="postsTitle-icon" />
          <h2 className="postsTitle">{user ? user.firstName : currentUser.firstName} {user ? user.lastName : currentUser.lastName}&apos;s Posts</h2>
          <span className="postCount">{posts.length} posts</span>
        </div>
        
        <div className="viewControls">
          <div className="sortOptions">
            <button 
              className={`sortButton ${sortMethod === "recent" ? 'active' : ''}`}
              onClick={() => setSortMethod("recent")}
            >
              <AccessTime className="sortIcon" />
              <span>Recent</span>
            </button>
            <button 
              className={`sortButton ${sortMethod === "popular" ? 'active' : ''}`}
              onClick={() => setSortMethod("popular")}
            >
              <Favorite className="sortIcon" />
              <span>Popular</span>
            </button>
          </div>
          
          <div className="viewModeToggle">
            <button 
              className={`viewModeButton ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 />
            </button>
            <button 
              className={`viewModeButton ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <div className="listIcon">
                <span></span><span></span><span></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Text-only posts horizontal scroll section - only in grid mode */}
      {viewMode === 'grid' && textOnlyPosts.length > 0 && (
        <div className="textOnlyPostsSection">
          <h3 className="sectionTitle">Text Posts</h3>
          <div className="textOnlyPostsScroll">
            {textOnlyPosts.map((post) => (
              <div className="textOnlyPostItem" key={post.id}>
                <Post post={post} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Photo posts section */}
      {photoPosts.length > 0 ? (
        <div className={`postsDisplay ${viewMode}`}>
          {photoPosts.map((post) => (
            <div className="profilePostItem" key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      ) : (
        textOnlyPosts.length === 0 && (
          <div className="emptyPostsMessage">
            <LocalFlorist className="emptyIcon" />
            <h3>No posts yet</h3>
            {user && user.id !== currentUser.id ? (
              <p>{user.username} hasn&apos;t shared any posts yet.</p>
            ) : (
              <p>You haven&apos;t shared anything yet. Get started by posting an idea!</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ProfilePosts;