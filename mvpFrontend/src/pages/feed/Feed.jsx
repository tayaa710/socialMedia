import './feed.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import FeedFilters from '../../components/feedFilters/FeedFilters'
import Post from '../../components/post/Post'
import PostCreate from '../../components/postCreate/PostCreate'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { postAPI } from '../../services/api'

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [excludedTags, setExcludedTags] = useState(['Adult'])
    // eslint-disable-next-line no-unused-vars
    const [filterSettings, setFilterSettings] = useState({})
    const { user } = useContext(AuthContext)

    const fetchPosts = async () => {
        try {
            const postsData = await postAPI.getPosts(user.id);
            setPosts(postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            console.log(postsData)
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }
    
    useEffect(() => {
        fetchPosts()
    }, [user.id])

    const handleNewPost = () => {
        fetchPosts() // Refresh posts when a new post is created
    }

    const handleFilterChange = ({ excludedTags, settings }) => {
        setExcludedTags(excludedTags)
        setFilterSettings(settings)
        
        // Apply filters to posts if needed
        console.log("Filter settings updated:", settings)
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
                        {posts.map((post) => {
                            // Can use filterSettings here to filter posts if needed
                            return (
                                <Post 
                                    key={post.id}
                                    post={post}
                                />
                            )
                        })}
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