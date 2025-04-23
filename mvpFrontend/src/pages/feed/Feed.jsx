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

    useEffect(() => {
        const fetchPosts = async () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhcm9udGF5bG9yMjQiLCJpZCI6IjY4MDg2MzlkMTU4ZDQyZTQ5ZGJlMmY0MSIsImlhdCI6MTc0NTM4MjQ3NiwiZXhwIjoxNzQ1OTg3Mjc2fQ.AdjUi4yHqdsWjq5WZC76R93GZQibBTTNlKW3fL2ySiE'
            const response = await axios.get('/api/timeline/6808639d158d42e49dbe2f41', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setPosts(response.data)
            console.log(response.data)
        }
        fetchPosts()
        
    }, [])

    const [excludedTags, setExcludedTags] = useState(['Adult'])
    const [filterSettings, setFilterSettings] = useState({})

    const handleFilterChange = ({ excludedTags, settings }) => {
        setExcludedTags(excludedTags)
        setFilterSettings(settings)
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