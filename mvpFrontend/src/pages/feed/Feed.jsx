import './feed.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import FeedFilters from '../../components/feedFilters/FeedFilters'
import Post from '../../components/post/Post'
import PostCreate from '../../components/postCreate/PostCreate'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [excludedTags, setExcludedTags] = useState(['Adult'])
    const [filterSettings, setFilterSettings] = useState({})

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("auth-token")
            const response = await axios.get('/api/timeline/6808639d158d42e49dbe2f41', {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            })
            setPosts(response.data)
            console.log(response.data)
        }
        fetchPosts()
        
    }, [])

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
                        
                        <PostCreate />
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