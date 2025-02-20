/* eslint-disable react/prop-types */
import './ProfileInfo.css'
export default function ProfileInfo() {
  return (
    <div className="infoContainer">
      
      <Info text={"25/01/2002"} title={"Birthday"} />
      <Info text={"23"} title={"Age"} />
      <Info text={"New Zealand"} title={"Country"} />
      <Info text={"Hamilton"} title={"City"} />

      <Info text={"In a relationship"} title={"Relationship Status"} />
      <Info text={"Studies at University of Otago"} title={"Education"} />
      <Info text={"02904306765"} title={"Mobile Number"} />
    </div>
  )
}

const Info = ({ title, text }) => {
  return (
    <div className='infoText'>
      <div className="title">{`${title}: `}</div>
      <div className="text">{text}</div>
    </div>
  )
}