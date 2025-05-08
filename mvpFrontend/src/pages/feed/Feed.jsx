import './feed.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Post from '../../components/post/Post'
import PostCreate from '../../components/postCreate/PostCreate'
import FeedFilters from '../../components/feedFilters/FeedFilters'
import { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { postAPI } from '../../services/api'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'


const Feed = () => {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [excludedTags, setExcludedTags] = useState(['Adult'])
    const [filterSettings, setFilterSettings] = useState({})
    const [loadingMethod, setLoadingMethod] = useState('infinite')
    const [postsPerPage, setPostsPerPage] = useState(15) // Default for infinite scroll
    const [totalPages, setTotalPages] = useState(1)
    const { user } = useContext(AuthContext)
    const [engagementQueue, setEngagementQueue] = useState([])
    const engagementQueueRef = useRef([])

    const observer = useRef()
    const lastPostElementRef = useCallback(node => {
        if (loading) return
        if (loadingMethod !== 'infinite') return
        
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
    
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
            }
        })
        
        if (node) {
            observer.current.observe(node)
        }
    }, [loading, hasMore, loadingMethod])

    // Keep the ref updated with the latest queue state
    useEffect(() => {
        engagementQueueRef.current = engagementQueue;
    }, [engagementQueue]);

    useEffect(() => {
        console.log('[Feed] Setting up engagement submission interval')
        const interval = setInterval(async () => {
            await sendEngagement()
        }, 10000);

        return async () => {
            clearInterval(interval)
            await sendEngagement()
        };
    }, []);

    const sendEngagement = async () => {
        // Use the ref to get the latest state
        const currentQueue = [...engagementQueueRef.current];
        
        if (currentQueue.length === 0) {
            console.log('[Feed] Engagement queue empty - nothing to send')
            return
        }

        console.log(`[Feed] Sending engagement data: ${currentQueue.length} items`)
        
        try {
            // Clear the queue first to prevent duplicate sends if the component re-renders
            setEngagementQueue([])
            
            await postAPI.sendEngagement(currentQueue)
            console.log('[Feed] Engagement data sent successfully')
        } catch (error) {
            console.error('[Feed] Error sending engagement:', error)
            
            // If there was an error, put the items back in the queue
            setEngagementQueue(prevQueue => {
                // Avoid duplicating items that might have been added since the error
                const itemsToRestore = currentQueue.filter(item => 
                    !prevQueue.some(existingItem => existingItem.postId === item.postId)
                )
                return [...prevQueue, ...itemsToRestore]
            })
        }
    }


    const fetchPosts = async (pageNum = 1, requestedPostsPerPage = null) => {
        try {
            const limit = requestedPostsPerPage || postsPerPage;
            setLoading(true);
            const response = await postAPI.getTimeline(user.id, pageNum, { 
                filterSettings, 
                excludedTags,
                limit
            });
            

            
            if (pageNum === 1 || loadingMethod === 'pagination') {
                setPosts(response.posts);
            } else {
                setPosts(prev => {
                    return [...prev, ...response.posts];
                });
            }
            
            setHasMore(response.hasMore);
            if (response.totalPages) {
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };
    
    useEffect(() => {
        fetchPosts(1)
    }, [user.id])

    useEffect(() => {
        if (page > 1 && loadingMethod !== 'pagination') {
            fetchPosts(page)
        }
    }, [page, loadingMethod])

    // When loading method changes to pagination, reset to page 1
    useEffect(() => {
        if (loadingMethod === 'pagination') {
            setPage(1)
            fetchPosts(1)
        }
    }, [loadingMethod])

    const handleNewPost = () => {
        setPage(1)
        fetchPosts(1) // Refresh posts when a new post is created
    }

    const handleFilterChange = ({ excludedTags, settings, loadingMethod: newLoadingMethod, postsPerPage: newPostsPerPage }) => { 

        
        setExcludedTags(excludedTags)
        setFilterSettings(settings)
        setLoadingMethod(newLoadingMethod)
        
        // Update posts per page
        let updatedPostsPerPage;
        
        if (newLoadingMethod === 'infinite') {
            // Always use 15 for infinite scroll
            updatedPostsPerPage = 15;
        } else if (newPostsPerPage) {
            // Use user selection for other modes
            updatedPostsPerPage = newPostsPerPage;
        } else if (loadingMethod === 'infinite' && newLoadingMethod !== 'infinite') {
            // Switching from infinite to another method, use default 20
            updatedPostsPerPage = 20;
        } else {
            // Keep current setting for other cases
            updatedPostsPerPage = postsPerPage;
        }
        
        setPostsPerPage(updatedPostsPerPage);
        setPage(1)
        
        // Call the API with updated state
        fetchPosts(1, updatedPostsPerPage)
        
        // Show feedback that filters were applied
        const feedback = document.createElement('div')
        feedback.className = 'filterAppliedFeedback'
        feedback.textContent = 'Filters applied!'
        document.body.appendChild(feedback)
        
        // Remove the feedback after animation
        setTimeout(() => {
            feedback.classList.add('fadeOut')
            setTimeout(() => {
                feedback.remove()
            }, 300) // Match this with the CSS fadeOut animation duration
        }, 1500)
    }

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            setPage(newPage);
            fetchPosts(newPage);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const renderPaginationControls = () => {
        if (loadingMethod !== 'pagination') return null;
        
        return (
            <div className="paginationControls">
                <button 
                    className="pageButton" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                >
                    <KeyboardArrowLeft />
                </button>
                <div className="pageIndicator">
                    <span className="currentPage">{page}</span>
                    <span className="pageDivider">/</span>
                    <span className="totalPages">{totalPages}</span>
                </div>
                <button 
                    className="pageButton" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || loading}
                >
                    <KeyboardArrowRight />
                </button>
            </div>
        );
    }

    return (
        <>
            <Topbar />
            <div className="feedContainer">
                <div className="feedSidebar">
                    <Sidebar />
                </div>

                <div className="feedCenter">
                    <div className="feedWrapper">
                        <PostCreate onPostCreated={handleNewPost} />
                        
                        {posts.length === 0 && !loading && (
                            <div className="noPostsMessage">
                                <p>No posts to display</p>
                            </div>
                        )}
                        
                        {posts.map((post, index) => {
                            if (posts.length === index + 1 && loadingMethod === 'infinite') {
                                return (
                                    <div ref={lastPostElementRef} key={post.id}>
                                        <Post post={post} isTimeline={true} setEngagementQueue={setEngagementQueue} />
                                    </div>
                                )
                            } else {
                                return <Post key={post.id} post={post} isTimeline={true} setEngagementQueue={setEngagementQueue} />
                            }
                        })}
                        
                        {loading && !isInitialLoad && (
                            <div className="loadingSpinner">
                                Loading more posts...
                            </div>
                        )}

                        {loadingMethod === 'loadmore' && hasMore && !loading && (
                            <button className="loadMoreButton" onClick={handleLoadMore}>
                                Load More Posts
                            </button>
                        )}

                        {renderPaginationControls()}
                    </div>
                </div>

                <div className="feedRightSidebar">
                    <FeedFilters 
                        onFilterChange={handleFilterChange}
                        initialExcludedTags={excludedTags}
                        initialLoadingMethod={loadingMethod}
                        initialPostsPerPage={postsPerPage}
                    />
                </div>
            </div>
        </>
    )
}

export default Feed