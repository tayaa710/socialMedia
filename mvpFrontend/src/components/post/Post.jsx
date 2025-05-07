/* eslint-disable react/prop-types */
import './post.css'
import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import Comments from '../comments/Comments'
import PostHeader from '../postHeader/PostHeader'
import PostContent from '../postContent/PostContent'
import PostActions from '../postActions/PostActions'

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initialize comments from post data
    if (post.comments) {
      setComments(post.comments)
    }
  }, [post.comments])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If post.user is already populated and has all the data we need, use it directly
        if (typeof post.user === 'object' && post.user !== null && post.user.firstName) {
          setUser(post.user)
        } else {
          // Otherwise fetch the user data using the user ID
          const userId = typeof post.user === 'object' ? post.user.id : post.user
          const userData = await userAPI.getUser(userId)
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } 
    }
    
    fetchUser()
  }, [post.user])

  if (!user) return null // Don't render until user data is loaded

  return (
    <div className="postContainer">
      <PostHeader 
        user={user} 
        createdAt={post.createdAt} 
      />
      
      <PostContent 
        post={post} 
        user={user} 
      />
      
      <div className="postContentWrapper">
        <PostActions 
          post={post} 
          comments={comments} 
          showComments={showComments} 
          setShowComments={setShowComments} 
        />

        {showComments && (
          <Comments 
            post={post} 
            comments={comments} 
            setComments={setComments} 
          />
        )}
      </div>
    </div>
  )
}

export default Post
