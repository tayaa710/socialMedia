import './feedFilters.css'
import { useState } from 'react'
import { 
  Close, TrendingUp, People, Pets, WbSunny, LocalFlorist, 
  EmojiEmotions, FactCheck, MenuBook, SentimentVerySatisfied, ExploreOutlined, 
  SpaOutlined, LightbulbOutlined, SentimentVeryDissatisfiedOutlined,
  AutorenewOutlined, MoreHorizOutlined, NavigateNextOutlined, FormatListNumberedOutlined
} from '@mui/icons-material'
import FilterSlider from './FilterSlider'

const FeedFilters = ({ 
  onFilterChange, 
  initialExcludedTags = ['Crypto'], 
  initialLoadingMethod = 'infinite',
  initialPostsPerPage = 15
}) => {
  const [excludedTags, setExcludedTags] = useState(initialExcludedTags)
  const [loadingMethod, setLoadingMethod] = useState(initialLoadingMethod)
  const [postsPerPage, setPostsPerPage] = useState(initialPostsPerPage)
  const [filterSettings, setFilterSettings] = useState({
    friendsVsCommunities: 50, // 0: all communities, 100: all friends
    newVsFollowing: 50, // 0: all following, 100: all new users
    controversialVsChill: 20, // 0: includes controversial, 100: only chill content
    factualVsEntertainment: 60, // 0: all entertainment, 100: all factual
    seriousVsLighthearted: 40 // 0: serious/in-depth, 100: lighthearted/fun
  })

  // Options for posts per page
  const postsPerPageOptions = [
    { value: 5, label: '5 posts' },
    { value: 10, label: '10 posts' },
    { value: 15, label: '15 posts' },
    { value: 20, label: '20 posts' },
    { value: 30, label: '30 posts' },
    { value: 50, label: '50 posts' }
  ]

  const presetModes = {
    zen: {
      friendsVsCommunities: 75, // More friends content
      newVsFollowing: 30, // Favor following over new users
      controversialVsChill: 90, // Max chill, no controversial
      factualVsEntertainment: 60, // Slightly more factual content
      seriousVsLighthearted: 70 // More lighthearted content
    },
    explore: {
      friendsVsCommunities: 20, // More communities content
      newVsFollowing: 80, // Boost new users
      controversialVsChill: 10, // Allow controversial content
      factualVsEntertainment: 50, // Balanced factual/entertainment
      seriousVsLighthearted: 50 // Balanced serious/lighthearted
    },
    focus: {
      friendsVsCommunities: 30, // More communities, but some friends
      newVsFollowing: 20, // Mostly people you follow
      controversialVsChill: 70, // Fairly chill, limit controversial
      factualVsEntertainment: 90, // Highly factual and educational
      seriousVsLighthearted: 20 // Serious and in-depth content
    },
    social: {
      friendsVsCommunities: 90, // Almost all friends content
      newVsFollowing: 40, // Favor people you follow
      controversialVsChill: 60, // Moderately chill
      factualVsEntertainment: 30, // More fun content
      seriousVsLighthearted: 80 // Very lighthearted and fun
    },
    educational: {
      friendsVsCommunities: 40, // Balanced but favoring communities
      newVsFollowing: 60, // Some new perspectives
      controversialVsChill: 50, // Balanced controversial/chill
      factualVsEntertainment: 85, // Very factual and educational
      seriousVsLighthearted: 30 // More serious and in-depth
    },
    meme: {
      friendsVsCommunities: 30, // More communities for diverse memes
      newVsFollowing: 50, // Balanced mix of familiar and new meme creators
      controversialVsChill: 30, // Some spicy memes allowed
      factualVsEntertainment: 10, // Almost all entertainment
      seriousVsLighthearted: 95 // Extremely lighthearted content
    },
    party: {
      friendsVsCommunities: 70, // More friends for the party vibe
      newVsFollowing: 70, // Discover new party people
      controversialVsChill: 40, // Some controversy for a lively party
      factualVsEntertainment: 20, // Heavy on entertainment
      seriousVsLighthearted: 90 // Very fun and lighthearted
    },
    surprise: {
      friendsVsCommunities: 50, // Balanced
      newVsFollowing: 80, // Heavily favor new and unknown
      controversialVsChill: 35, // Mix of controversial and chill
      factualVsEntertainment: 50, // Balanced learning and fun
      seriousVsLighthearted: 50 // Balanced serious and lighthearted
    }
  }

  const handleRemoveTag = (tag) => {
    const newExcludedTags = excludedTags.filter(t => t !== tag);
    setExcludedTags(newExcludedTags);
    onFilterChange({ 
      excludedTags: newExcludedTags, 
      settings: filterSettings, 
      loadingMethod,
      postsPerPage 
    });
  }

  const handleAddExcludedTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newExcludedTags = [...excludedTags, e.target.value.trim()];
      setExcludedTags(newExcludedTags);
      onFilterChange({ 
        excludedTags: newExcludedTags, 
        settings: filterSettings, 
        loadingMethod,
        postsPerPage 
      });
      e.target.value = '';
    }
  }

  const handleSliderChange = (setting, value) => {
    const newSettings = {
      ...filterSettings,
      [setting]: value
    };
    setFilterSettings(newSettings);
    onFilterChange({ 
      excludedTags, 
      settings: newSettings, 
      loadingMethod,
      postsPerPage 
    });
  }

  const applyPresetMode = (mode) => {
    const newSettings = presetModes[mode];
    setFilterSettings(newSettings);
    onFilterChange({ 
      excludedTags, 
      settings: newSettings, 
      loadingMethod,
      postsPerPage 
    });
  }

  const handleLoadingMethodChange = (method) => {
    // Set posts per page based on the loading method
    let newPostsPerPage = postsPerPage;
    
    if (method === 'infinite') {
      // Always use 15 for infinite scroll
      newPostsPerPage = 15;
    } else if (loadingMethod === 'infinite') {
      // When switching from infinite to another method, use default 20
      newPostsPerPage = 20;
    } else {
      // When switching between pagination and loadmore, keep current setting
      newPostsPerPage = postsPerPage;
    }
    
    setLoadingMethod(method);
    setPostsPerPage(newPostsPerPage);
    
    onFilterChange({ 
      excludedTags, 
      settings: filterSettings, 
      loadingMethod: method,
      postsPerPage: newPostsPerPage 
    });
  }
  
  const handlePostsPerPageChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setPostsPerPage(newValue);
    onFilterChange({ 
      excludedTags, 
      settings: filterSettings, 
      loadingMethod,
      postsPerPage: newValue 
    });
  }

  // Define sliders configuration
  const sliders = [
    {
      setting: 'friendsVsCommunities',
      leftIcon: <People />,
      rightIcon: <Pets />,
      leftLabel: 'Friends',
      rightLabel: 'Communities'
    },
    {
      setting: 'newVsFollowing',
      leftIcon: <LocalFlorist />,
      rightIcon: null,
      leftLabel: 'People I Follow',
      rightLabel: 'New Users'
    },
    {
      setting: 'controversialVsChill',
      leftIcon: <TrendingUp />,
      rightIcon: <WbSunny />,
      leftLabel: 'Show Controversial',
      rightLabel: 'Keep it Chill'
    },
    {
      setting: 'factualVsEntertainment',
      leftIcon: <EmojiEmotions />,
      rightIcon: <FactCheck />,
      leftLabel: 'Fun & Memes',
      rightLabel: 'Educational & Factual'
    },
    {
      setting: 'seriousVsLighthearted',
      leftIcon: <MenuBook />,
      rightIcon: <SentimentVerySatisfied />,
      leftLabel: 'Serious & In-depth',
      rightLabel: 'Lighthearted & Fun'
    }
  ];

  return (
    <div className="feedControls">
      <div className="filterPanel">
        <h3>Feed Preferences</h3>
        
        <div className="presetModesContainer">
          <h4>Quick Presets:</h4>
          <div className="presetButtonsGrid">
            <button 
              className="presetButton zenMode" 
              onClick={() => applyPresetMode('zen')}
            >
              <SpaOutlined className="presetIcon" />
              <div className="presetInfo">
                <span>Zen Mode</span>
                <small>Max chill, no controversial, more friends</small>
              </div>
            </button>
            
            <button 
              className="presetButton exploreMode" 
              onClick={() => applyPresetMode('explore')}
            >
              <ExploreOutlined className="presetIcon" />
              <div className="presetInfo">
                <span>Explore Mode</span>
                <small>Boost new users, communities, controversial</small>
              </div>
            </button>

            <button 
              className="presetButton focusMode" 
              onClick={() => applyPresetMode('focus')}
            >
              <LightbulbOutlined className="presetIcon" />
              <div className="presetInfo">
                <span>Focus Mode</span>
                <small>Factual, serious, educational content</small>
              </div>
            </button>

            <button 
              className="presetButton memeMode" 
              onClick={() => applyPresetMode('meme')}
            >
              <SentimentVeryDissatisfiedOutlined className="presetIcon" />
              <div className="presetInfo">
                <span>Meme Mode</span>
                <small>Entertainment and lighthearted content</small>
              </div>
            </button>
          </div>
        </div>
        
        <div className="loadingOptionsContainer">
          <h4>Feed Loading Method:</h4>
          <div className="loadingButtons">
            <button 
              className={`loadingButton ${loadingMethod === 'infinite' ? 'active' : ''}`}
              onClick={() => handleLoadingMethodChange('infinite')}
            >
              <AutorenewOutlined className="loadingIcon" />
              <div className="loadingInfo">
                <span>Infinite Scroll</span>
                <small>Posts load as you scroll down</small>
              </div>
            </button>
            
            <button 
              className={`loadingButton ${loadingMethod === 'loadmore' ? 'active' : ''}`}
              onClick={() => handleLoadingMethodChange('loadmore')}
            >
              <MoreHorizOutlined className="loadingIcon" />
              <div className="loadingInfo">
                <span>Load More</span>
                <small>Click a button to load more posts</small>
              </div>
            </button>
            
            <button 
              className={`loadingButton ${loadingMethod === 'pagination' ? 'active' : ''}`}
              onClick={() => handleLoadingMethodChange('pagination')}
            >
              <NavigateNextOutlined className="loadingIcon" />
              <div className="loadingInfo">
                <span>Pagination</span>
                <small>Navigate between pages of posts</small>
              </div>
            </button>
          </div>
          
          {loadingMethod !== 'infinite' && (
            <div className="postsPerPageContainer">
              <div className="postsPerPageHeader">
                <FormatListNumberedOutlined className="postsPerPageIcon" />
                <h4>Posts Per Page:</h4>
              </div>
              <select 
                value={postsPerPage} 
                onChange={handlePostsPerPageChange}
                className="postsPerPageSelect"
              >
                {postsPerPageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="postsPerPageHint">
                Default: 20 posts per page
              </div>
            </div>
          )}
        </div>

        <div className="slidersWrapper">
          <h4>Fine-Tune Your Feed:</h4>
          {sliders.map((slider) => (
            <FilterSlider 
              key={slider.setting}
              setting={slider.setting}
              value={filterSettings[slider.setting]}
              onChange={handleSliderChange}
              leftIcon={slider.leftIcon}
              rightIcon={slider.rightIcon}
              leftLabel={slider.leftLabel}
              rightLabel={slider.rightLabel}
            />
          ))}
        </div>
        
        <div className="excludeFilters">
          <h4>Hide posts with these tags:</h4>
          <div className="excludedTags">
            {excludedTags.map(tag => (
              <div key={tag} className="excludedTag">
                <span>#{tag}</span>
                <button onClick={() => handleRemoveTag(tag)}>
                  <Close fontSize="small" className="greenIcon" />
                </button>
              </div>
            ))}
          </div>
          <input 
            type="text" 
            className="excludeInput"
            placeholder="Add tag to exclude... (press Enter)" 
            onKeyDown={handleAddExcludedTag}
            name="excludeTag"
            id="excludeTag"
          />
        </div>
      </div>
    </div>
  )
}

export default FeedFilters 