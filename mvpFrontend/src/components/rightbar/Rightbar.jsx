import './rightbar.css'

const Rightbar = () => {
  return (
    <div className="rightWrapper">
      <div className="suggestionsContainer">
        <h3 className="rightTitle">Suggested For You</h3>
        <ul className="suggestionsList">
          <li className="suggestionItem">
            <div className="suggestionProfile">
              <span className="suggestionName">John Doe</span>
              <span className="suggestionInfo">Photographer</span>
            </div>
            <button className="followButton">Follow</button>
          </li>
          <li className="suggestionItem">
            <div className="suggestionProfile">
              <span className="suggestionName">Jane Smith</span>
              <span className="suggestionInfo">Developer</span>
            </div>
            <button className="followButton">Follow</button>
          </li>
          <li className="suggestionItem">
            <div className="suggestionProfile">
              <span className="suggestionName">Alex Johnson</span>
              <span className="suggestionInfo">Designer</span>
            </div>
            <button className="followButton">Follow</button>
          </li>
        </ul>
      </div>
      
      <div className="trendingContainer">
        <h3 className="rightTitle">Trending Topics</h3>
        <ul className="trendingList">
          <li className="trendingItem">
            <span className="trendingTopic">#Photography</span>
            <span className="trendingPosts">1.2k posts</span>
          </li>
          <li className="trendingItem">
            <span className="trendingTopic">#WebDev</span>
            <span className="trendingPosts">856 posts</span>
          </li>
          <li className="trendingItem">
            <span className="trendingTopic">#UI/UX</span>
            <span className="trendingPosts">642 posts</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Rightbar 