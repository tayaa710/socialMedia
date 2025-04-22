/* eslint-disable react/prop-types */
import Post from "../post/Post";
import "./profilePosts.css";
import { useState, useEffect } from "react";
import { LocalFlorist} from "@mui/icons-material";
import { Posts } from "../../data/dummyData";
const ProfilePosts = ({user}) => {
  const [posts, setPosts] = useState([])
  const userId = user.id

  useEffect(() => {
    const userPosts = Posts.filter(post => post.userId === userId)
    setPosts(userPosts)
  }, [userId])

  return (
    <div className="postsContainer">
      <div className="postsHeader">
        <div className="postsTitle-wrapper">
          <LocalFlorist className="postsTitle-icon" />
          <h2 className="postsTitle">{user.username}&apos;s Posts</h2>
        </div>
      </div>
      
      <div className="postVerificationBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <LocalFlorist className="verificationIcon" />
          <p>Play on said the ref yeah yeah</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="postsGridContainer">
        <div className="leaf-decoration top-left"></div>
        <div className="leaf-decoration bottom-right"></div>
        
        <div className="posts-grid">
            {posts.map((post) => (
              <div className="profile-post-item" key={post.id}>
                <Post post={post} />
              </div>
            ))}
          
        </div>
        
      </div>
    </div>
  )
}

export default ProfilePosts;