/* eslint-disable react/prop-types */
import './post.css'
import { useState, useEffect, useRef } from 'react'
import { userAPI } from '../../services/api'
import Comments from '../comments/Comments'
import PostHeader from '../postHeader/PostHeader'
import PostContent from '../postContent/PostContent'
import PostActions from '../postActions/PostActions'
import { useInView } from 'react-intersection-observer'

const LONG_VIEW_THRESHOLD = 5 //seconds
const SKIP_THRESHOLD = 1.6 //seconds

const Post = ({ post, isTimeline = true, setEngagementQueue }) => {
  
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [user, setUser] = useState(null)
  const viewStartTimeRef = useRef(null)
  const engagementTrackedRef = useRef(false)
  const postIdRef = useRef(post.id)

  const [ref, inView] = useInView({
    threshold: 0.25
  })

  useEffect(() => {
    // Initialize comments from post data
    if (post.comments) {
      setComments(post.comments)
    }
  }, [post.comments])

  // Reset tracking when post ID changes
  useEffect(() => {
    if (postIdRef.current !== post.id) {
      engagementTrackedRef.current = false;
      viewStartTimeRef.current = null;
      postIdRef.current = post.id;
    }
  }, [post.id]);

  // Track post visibility
  useEffect(() => {
    if (!isTimeline || engagementTrackedRef.current) return;

    if (inView) {
      // Start tracking when post comes into view
      if (!viewStartTimeRef.current) {
        viewStartTimeRef.current = Date.now();
        console.log(`[Post ${post.id}] Started viewing at ${new Date(viewStartTimeRef.current).toISOString()}`);
      }
    } else if (viewStartTimeRef.current) {
      // Record engagement when post goes out of view
      const viewDuration = (Date.now() - viewStartTimeRef.current) / 1000;
      const skipped = viewDuration < SKIP_THRESHOLD;
      const longView = viewDuration >= LONG_VIEW_THRESHOLD;
      
      console.log(`[Post ${post.id}] Stopped viewing after ${viewDuration.toFixed(2)}s (skipped=${skipped}, longView=${longView})`);
      
      setEngagementQueue(prevQueue => {
        const newQueue = [...prevQueue, {
          postId: post.id,
          viewDuration,
          longView,
          skipped
        }];
        console.log(`[Post ${post.id}] Added to engagement queue. Queue size: ${newQueue.length}`);
        return newQueue;
      });
      
      viewStartTimeRef.current = null;
      engagementTrackedRef.current = true;
    }
  }, [inView, isTimeline, post.id, setEngagementQueue]);

  // Handle component unmount - only track if not already tracked
  useEffect(() => {
    return () => {
      if (isTimeline && viewStartTimeRef.current && !engagementTrackedRef.current) {
        const viewDuration = (Date.now() - viewStartTimeRef.current) / 1000;
        const skipped = viewDuration < SKIP_THRESHOLD;
        const longView = viewDuration >= LONG_VIEW_THRESHOLD;
        
        setEngagementQueue(prevQueue => {
          const newQueue = [...prevQueue, {
            postId: post.id,
            viewDuration,
            longView,
            skipped
          }];
          console.log(`[Post ${post.id}] Added to engagement queue on unmount. Queue size: ${newQueue.length}`);
          return newQueue;
        });
      }
    };
  }, [isTimeline, post.id, setEngagementQueue]);

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
  }, [post.user, post.id])

  if (!user) return null // Don't render until user data is loaded

  return (
    <div className="postContainer" ref={ref}>
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
