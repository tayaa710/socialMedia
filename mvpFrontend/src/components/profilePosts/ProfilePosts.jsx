/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./profilePosts.css";
import { LocalFlorist, AccessTime, Favorite, Grid3x3 } from "@mui/icons-material";
import { Posts } from "../../data/dummyData";
import Post from "../post/Post";

const ProfilePosts = ({user}) => {
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const userId = user.id;

  useEffect(() => {
    const userPosts = Posts.filter(post => post.userId === userId);
    setPosts(userPosts);
  }, [userId]);

  const sortedPosts = () => {
    if (sortMethod === "popular") {
      return [...posts].sort((a, b) => b.like - a.like);
    } else if (sortMethod === "recent") {
      return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return posts;
  };

  return (
    <div className="profilePostsContainer">
      <div className="profilePostsHeader">
        <div className="postsTitle-wrapper">
          <LocalFlorist className="postsTitle-icon" />
          <h2 className="postsTitle">{user.username}&apos;s Posts</h2>
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
      
      {posts.length > 0 ? (
        <div className={`postsDisplay ${viewMode}`}>
          {sortedPosts().map((post) => (
            <div className="profilePostItem" key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyPostsMessage">
          <LocalFlorist className="emptyIcon" />
          <h3>No posts yet</h3>
          <p>{user.username} hasn&apos;t shared any posts yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;