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
    const [excludedTags, setExcludedTags] = useState(['Adult'])
    const [filterSettings, setFilterSettings] = useState({})
    const [loadingMethod, setLoadingMethod] = useState('infinite')
    const [postsPerPage, setPostsPerPage] = useState(15) // Default for infinite scroll
    const [totalPages, setTotalPages] = useState(1)
    const { user } = useContext(AuthContext)
    const filtersPanelRef = useRef(null)

    const observer = useRef()

    // Intersection observer for infinite scroll
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

    // Fetch posts from the API
    const fetchPosts = useCallback(async (pageNum = 1, requestedPostsPerPage = null) => {
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
                setPosts(prev => [...prev, ...response.posts]);
            }

            setHasMore(response.hasMore);
            if (response.totalPages) {
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, [user.id, postsPerPage, filterSettings, excludedTags, loadingMethod]);

    // Fetch initial posts
    useEffect(() => {
        fetchPosts(1)
    }, [fetchPosts])

    // Fetch more posts when the page changes
    useEffect(() => {
        if (page > 1 && loadingMethod !== 'pagination') {
            fetchPosts(page)
        }
    }, [page, loadingMethod, fetchPosts])

    // When loading method changes to pagination, reset to page 1
    useEffect(() => {
        if (loadingMethod === 'pagination') {
            setPage(1)
            fetchPosts(1)
        }
    }, [loadingMethod, fetchPosts])

    // Refresh posts when a new post is created
    const handleNewPost = () => {
        setPage(1)
        fetchPosts(1) 
    }

    // Handle filter changes
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
    // Load more posts
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }

    // Handle page changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            setPage(newPage);
            fetchPosts(newPage);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Render pagination controls
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
                                console.log(`🏁 Attaching ref to last post (index: ${index})`)
                                return (
                                    <div ref={lastPostElementRef} key={post.id}>
                                        <Post post={post} />
                                    </div>
                                )
                            } else {
                                return <Post key={post.id} post={post} />
                            }
                        })}

                        {loading && (
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

                <div className="feedRightSidebar" ref={filtersPanelRef}>
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