/* eslint-disable react/prop-types */
import './ProfileInfo.css'
import { School, Favorite, Cake, AccessTime, Public, LocationOn, Phone, LocalFlorist } from '@mui/icons-material'

export default function ProfileInfo() {
  return (
    <div className="infoContainer">
      <div className="infoHeader">
        <LocalFlorist className="infoTitle-icon" />
        <h2 className="infoTitle">Your Personal Journey</h2>
      </div>
      
      <div className="infoBanner">
        <div className="banner-graphic left"></div>
        <div className="banner-content">
          <p>Your authentic self is what makes this community special. Share what makes you unique.</p>
        </div>
        <div className="banner-graphic right"></div>
      </div>
      
      <div className="infoSections">
        <div className="infoSection">
          <h3 className="sectionTitle">Personal</h3>
          <div className="infoCards">
            <InfoCard icon={<Cake />} title="Birthday" text="25/01/2002" />
            <InfoCard icon={<AccessTime />} title="Age" text="23" />
            <InfoCard icon={<Public />} title="Country" text="New Zealand" />
            <InfoCard icon={<LocationOn />} title="City" text="Hamilton" />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Relationships</h3>
          <div className="infoCards">
            <InfoCard icon={<Favorite />} title="Relationship Status" text="In a relationship" />
            <InfoCard icon={<School />} title="Education" text="Studies at University of Otago" />
            <InfoCard icon={<Phone />} title="Mobile Number" text="02904306765" />
          </div>
        </div>
        
        <div className="infoSection">
          <h3 className="sectionTitle">Values & Interests</h3>
          <div className="infoCards values">
            <ValueTag text="Environmental Sustainability" />
            <ValueTag text="Digital Wellbeing" />
            <ValueTag text="Community Building" />
            <ValueTag text="Ethical Technology" />
            <ValueTag text="Mindfulness" />
            <ValueTag text="Outdoor Activities" />
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