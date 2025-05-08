import React from 'react'
import './filterSlider.css'

const FilterSlider = ({ 
  setting, 
  value, 
  onChange, 
  leftIcon, 
  rightIcon, 
  leftLabel, 
  rightLabel
}) => {
  // Define tooltip descriptions for each slider position
  const getTooltips = () => {
    const tooltips = {
      friendsVsCommunities: {
        0: "Only content from communities",
        25: "Mostly community content",
        50: "Balanced mix of friends and communities",
        75: "Mostly content from friends",
        100: "Only content from friends"
      },
      newVsFollowing: {
        0: "Only from people you follow",
        25: "Mostly people you follow",
        50: "Balanced mix of following and new users",
        75: "Mostly new users",
        100: "Discover content from new users only"
      },
      factualVsEntertainment: {
        0: "Entertainment and memes only",
        25: "Mostly entertainment, some educational",
        50: "Balance of educational and fun content",
        75: "Mostly factual, some entertainment",
        100: "Factual and educational content only"
      },
      seriousVsLighthearted: {
        0: "Serious and in-depth content only",
        25: "Mostly serious content",
        50: "Mix of serious and lighthearted content",
        75: "Mostly lighthearted content",
        100: "Fun and lighthearted content only"
      },
      recentVsPopular: {
        0: "Only recent content, regardless of popularity",
        25: "Mostly recent content, some popular",
        50: "Balance of recent and popular content",
        75: "Mostly popular content, some recent",
        100: "Only popular content, regardless of age"
      },
      textHeavyVsImageHeavy: {
        0: "Text-heavy content only",
        25: "Mostly text content, some images",
        50: "Balance of text and image content",
        75: "Mostly image content, some text",
        100: "Image-heavy content only"
      },
      localVsGlobal: {
        0: "Only local content from your area",
        25: "Mostly local content, some global",
        50: "Balance of local and global content",
        75: "Mostly global content, some local",
        100: "Global content from anywhere"
      }
    };

    return tooltips[setting] || {};
  };

  const tooltips = getTooltips();
  
  // Get a description for the current value
  const getCurrentValueDescription = () => {
    // For exact matches with our predefined values
    if (tooltips[value]) {
      return tooltips[value];
    }
    
    // For values in between, show the closest description
    if (value < 12) {
      return tooltips[0];
    } else if (value < 37) {
      return tooltips[25];
    } else if (value < 62) {
      return tooltips[50]; 
    } else if (value < 87) {
      return tooltips[75];
    } else {
      return tooltips[100];
    }
  };
  
  // Handle click on a tooltip marker to set slider value
  const handleMarkerClick = (markerValue) => {
    onChange(setting, markerValue);
  };
  
  // Determine if a marker should be highlighted based on the current value
  const isMarkerActive = (markerValue) => {
    if (value === markerValue) return true;
    
    if (value < 12 && markerValue === 0) return true;
    if (value >= 12 && value < 37 && markerValue === 25) return true;
    if (value >= 37 && value < 62 && markerValue === 50) return true;
    if (value >= 62 && value < 87 && markerValue === 75) return true;
    if (value >= 87 && markerValue === 100) return true;
    
    return false;
  };

  return (
    <div className="sliderContainer">
      <div className="sliderLabels">
        <div className="sliderLeftLabel">
          {leftIcon && React.cloneElement(leftIcon, { className: "greenIcon" })}
          <span>{leftLabel}</span>
        </div>
        <div className="sliderRightLabel">
          {rightIcon && React.cloneElement(rightIcon, { className: "greenIcon" })}
          <span>{rightLabel}</span>
        </div>
      </div>
      
      <div className="sliderTooltips">
        <div 
          className="tooltipMarker" 
          onClick={() => handleMarkerClick(0)}
          data-active={isMarkerActive(0)}
        >
          0%<span className="tooltipText">{tooltips[0]}</span>
        </div>
        <div 
          className="tooltipMarker" 
          onClick={() => handleMarkerClick(25)}
          data-active={isMarkerActive(25)}
        >
          25%<span className="tooltipText">{tooltips[25]}</span>
        </div>
        <div 
          className="tooltipMarker" 
          onClick={() => handleMarkerClick(50)}
          data-active={isMarkerActive(50)}
        >
          50%<span className="tooltipText">{tooltips[50]}</span>
        </div>
        <div 
          className="tooltipMarker" 
          onClick={() => handleMarkerClick(75)}
          data-active={isMarkerActive(75)}
        >
          75%<span className="tooltipText">{tooltips[75]}</span>
        </div>
        <div 
          className="tooltipMarker" 
          onClick={() => handleMarkerClick(100)}
          data-active={isMarkerActive(100)}
        >
          100%<span className="tooltipText">{tooltips[100]}</span>
        </div>
      </div>
      
      <div className="sliderWithTicks">
        <div className="tickMarks">
          <div className="tickMark"></div>
          <div className="tickMark"></div>
          <div className="tickMark"></div>
          <div className="tickMark"></div>
          <div className="tickMark"></div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value}
          onChange={(e) => onChange(setting, e.target.value)}
          className="slider"
          list="tickmarks"
        />
      </div>
      
      <div className="sliderValue">
        <span>{value}%</span>
        <span className="currentValueTooltip">{getCurrentValueDescription()}</span>
      </div>
    </div>
  )
}

export default FilterSlider 