import './feed.css'
import { useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import FeedFilters from '../../components/feedFilters/FeedFilters'
import Post from '../../components/post/Post'
import PostCreate from '../../components/postCreate/PostCreate'

const Feed = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            date: 'July 24, 2023',
            likes: 142,
            image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1',
            caption: 'Beautiful sunset at the beach today!',
            user: 'Alex Morgan',
            reason: 'You follow Alex Morgan',
            tags: ['Nature', 'Travel']
        },
        {
            id: 2,
            date: 'July 22, 2023',
            likes: 89,
            image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
            caption: 'Homemade breakfast - starting the day right',
            user: 'Jamie Chen',
            reason: 'You liked similar cooking posts',
            tags: ['Food', 'Cooking']
        },
        {
            id: 3,
            date: 'July 20, 2023',
            likes: 215,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            caption: 'Weekend hiking trip to the mountains',
            user: 'Hiking Community',
            reason: 'Popular in communities you follow',
            tags: ['Outdoors', 'Hiking']
        },
        {
            id: 4,
            date: 'July 18, 2023',
            likes: 76,
            image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44',
            caption: 'Check out this amazing cryptocurrency opportunity!',
            user: 'CryptoEnthusiast',
            reason: 'Trending in your area',
            tags: ['Crypto', 'Finance']
        },
        {
            id: 5,
            date: 'July 17, 2023',
            likes: 128,
            image: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
            caption: 'My new tech setup for 2023',
            user: 'TechGuru',
            reason: 'Based on your interest in technology',
            tags: ['Tech', 'Gadgets']
        }
    ])

    const [excludedTags, setExcludedTags] = useState(['Crypto'])
    const [filterSettings, setFilterSettings] = useState({})

    // Filter posts based on excluded tags
    const filteredPosts = posts.filter(post => {
        return !post.tags.some(tag => excludedTags.includes(tag))
    })

    const handleFilterChange = ({ excludedTags, settings }) => {
        setExcludedTags(excludedTags)
        setFilterSettings(settings)
        // In a real app, you'd likely fetch posts based on these filter settings
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
                        
                        {filteredPosts.map(post => (
                            <Post 
                                key={post.id}
                                date={post.date}
                                likes={post.likes}
                                image={post.image}
                                caption={post.caption}
                                user={post.user}
                                reason={post.reason}
                                tags={post.tags}
                            />
                        ))}
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