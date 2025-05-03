/* eslint-disable react/prop-types */
import './profileInfo.css'
import { School, Favorite, Cake, AccessTime, Public, LocationOn, Phone, LocalFlorist } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ProfileInfo = ({user}) => {
  const { user: currentUser } = useContext(AuthContext);
  const displayUser = user || currentUser;
  
  return (
    <div className="infoContainer">
      <div className="infoHeader">
        <LocalFlorist className="infoTitle-icon" />
        <h2 className="infoTitle">{displayUser.firstName} {displayUser.lastName}&apos;s Personal Journey</h2>
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
            <InfoCard icon={<Cake />} title="Birthday" text={displayUser.personal?.birthday} />
            <InfoCard icon={<AccessTime />} title="Age" text={displayUser.age} />
            <InfoCard icon={<Public />} title="Country" text={displayUser.personal?.country || displayUser.location} />
            <InfoCard icon={<LocationOn />} title="City" text={displayUser.personal?.city} />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Relationships</h3>
          <div className="infoCards">
            <InfoCard icon={<Favorite />} title="Relationship Status" text={displayUser.relationships?.status} />
            <InfoCard icon={<School />} title="Education" text={displayUser.relationships?.education} />
            <InfoCard icon={<Phone />} title="Mobile Number" text={displayUser.relationships?.phone} />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Values & Interests</h3>
          <div className="infoCards values">
            {displayUser.values?.length > 0 ? (
              displayUser.values.map((value, index) => (
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