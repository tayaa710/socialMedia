import './feed.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import FeedFilters from '../../components/feedFilters/FeedFilters'
import Post from '../../components/post/Post'
import PostCreate from '../../components/postCreate/PostCreate'
import { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { postAPI } from '../../services/api'

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [excludedTags, setExcludedTags] = useState(['Adult'])
    const [filterSettings, setFilterSettings] = useState({})
    const { user } = useContext(AuthContext)
    
    const observer = useRef()
    const lastPostElementRef = useCallback(node => {
        if (loading) return
        
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
            console.log('🔍 Intersection observer triggered:', entries[0].isIntersecting ? 'Element is visible' : 'Element not visible')
            if (entries[0].isIntersecting && hasMore) {
                console.log('📜 Loading next page:', page + 1)
                setPage(prevPage => prevPage + 1)
            }
        })
        
        if (node) {
            console.log('🔄 Observer attached to new post element')
            observer.current.observe(node)
        }
    }, [loading, hasMore, page])

    const fetchPosts = async (pageNum = 1) => {
        try {
            console.log(`📊 Fetching posts page ${pageNum}`)
            setLoading(true)
            const response = await postAPI.getTimeline(user.id, pageNum);
            
            console.log(`✅ Fetched ${response.posts.length} posts for page ${pageNum}`)
            console.log(`📈 Has more posts: ${response.hasMore}`)
            
            if (pageNum === 1) {
                setPosts(response.posts)
                console.log('🔄 Reset posts list with new data')
            } else {
                setPosts(prev => {
                    console.log(`🔄 Adding ${response.posts.length} new posts to existing ${prev.length} posts`)
                    return [...prev, ...response.posts]
                })
            }
            
            setHasMore(response.hasMore)
        } catch (error) {
            console.error("❌ Failed to fetch posts:", error);
        } finally {
            setLoading(false)
            console.log('⏳ Loading state set to false')
        }
    }
    
    useEffect(() => {
        console.log('👤 User changed, fetching initial posts')
        fetchPosts(1)
    }, [user.id])

    useEffect(() => {
        if (page > 1) {
            console.log(`📄 Page changed to ${page}, fetching more posts`)
            fetchPosts(page)
        }
    }, [page])

    const handleNewPost = () => {
        console.log('📝 New post created, refreshing feed')
        setPage(1)
        fetchPosts(1) // Refresh posts when a new post is created
    }

    const handleFilterChange = ({ excludedTags, settings }) => {
        console.log('🔍 Filters changed, refreshing feed with new filters')
        console.log('🏷️ Excluded tags:', excludedTags)
        console.log('⚙️ Filter settings:', settings)
        setExcludedTags(excludedTags)
        setFilterSettings(settings)
        setPage(1)
        fetchPosts(1)
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
                        <FeedFilters 
                            onFilterChange={handleFilterChange}
                            initialExcludedTags={excludedTags}
                        />
                        
                        <PostCreate onPostCreated={handleNewPost} />
                        
                        {posts.length === 0 && !loading && (
                            <div className="noPostsMessage">
                                <p>No posts to display</p>
                            </div>
                        )}
                        
                        {posts.map((post, index) => {
                            if (posts.length === index + 1) {
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
                    </div>
                </div>

                <div className="feedRight">
                    <Rightbar />
                </div>
            </div>
        </>
    )
}

export default Feed