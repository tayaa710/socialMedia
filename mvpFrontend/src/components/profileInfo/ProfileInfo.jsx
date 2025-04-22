/* eslint-disable react/prop-types */
import './ProfileInfo.css'
import { useState, useEffect } from 'react'
import { School, Favorite, Cake, AccessTime, Public, LocationOn, Phone, LocalFlorist } from '@mui/icons-material'
import { getUserByUsername, formatEducation } from '../../utils/userDataUtils'

const ProfileInfo = ({ username = "Aaron" }) => {
  const [userInfo, setUserInfo] = useState({
    personal: {
      birthday: "25/01/2002",
      age: "23",
      country: "New Zealand",
      city: "Hamilton"
    },
    relationships: {
      status: "In a relationship",
      education: "Studies at University of Otago",
      phone: "02904306765"
    },
    values: [
      "Environmental Sustainability",
      "Digital Wellbeing",
      "Community Building",
      "Ethical Technology",
      "Mindfulness",
      "Outdoor Activities"
    ]
  });

  useEffect(() => {
    // Get user data from sample users
    const user = getUserByUsername(username);
    
    if (user) {
      // Format the date
      const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/');
      };
      
      setUserInfo({
        personal: {
          birthday: formatDate(user.birthday),
          age: user.age?.toString() || "—",
          country: user.country || "—",
          city: user.city || "—"
        },
        relationships: {
          status: user.relationshipStatus || "Not specified",
          education: formatEducation(user) || "Not specified",
          phone: user.mobileNumber || "Not shared"
        },
        values: user.valuesAndInterests || []
      });
    }
  }, [username]);

  return (
    <div className="infoContainer">
      <div className="infoHeader">
        <LocalFlorist className="infoTitle-icon" />
        <h2 className="infoTitle">{username}'s Personal Journey</h2>
      </div>
      
      <div className="infoBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <p>Authentic profiles help build meaningful connections in our community.</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="infoSections">
        <div className="infoSection">
          <h3 className="sectionTitle">Personal</h3>
          <div className="infoCards">
            <InfoCard icon={<Cake />} title="Birthday" text={userInfo.personal.birthday} />
            <InfoCard icon={<AccessTime />} title="Age" text={userInfo.personal.age} />
            <InfoCard icon={<Public />} title="Country" text={userInfo.personal.country} />
            <InfoCard icon={<LocationOn />} title="City" text={userInfo.personal.city} />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Relationships</h3>
          <div className="infoCards">
            <InfoCard icon={<Favorite />} title="Relationship Status" text={userInfo.relationships.status} />
            <InfoCard icon={<School />} title="Education" text={userInfo.relationships.education} />
            <InfoCard icon={<Phone />} title="Mobile Number" text={userInfo.relationships.phone} />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Values & Interests</h3>
          <div className="infoCards values">
            {userInfo.values.length > 0 ? (
              userInfo.values.map((value, index) => (
                <ValueTag key={index} text={value} />
              ))
            ) : (
              <p className="noValueMessage">No values or interests specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({ icon, title, text }) => {
  return (
    <div className='infoCard'>
      <div className="cardIcon">{icon}</div>
      <div className="cardContent">
        <div className="cardTitle">{title}</div>
        <div className="cardText">{text}</div>
      </div>
    </div>
  )
}

const ValueTag = ({ text }) => {
  return (
    <div className="valueTag">
      <LocalFlorist className="valueIcon" />
      <span>{text}</span>
    </div>
  )
}

export default ProfileInfo