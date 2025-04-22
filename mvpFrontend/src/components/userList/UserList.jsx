import React from 'react';
import { Link } from 'react-router-dom';
import './userList.css';

const UserList = () => {
  // Hardcoded sample users
  const sampleUsers = [
    {
      username: 'Sarah',
      firstName: 'Sarah',
      lastName: 'Johnson',
      profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
      description: 'Passionate about environmental conservation and sustainable living.'
    },
    {
      username: 'Michael',
      firstName: 'Michael',
      lastName: 'Williams',
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      description: 'Tech enthusiast working on solutions for climate change.'
    },
    {
      username: 'Emma',
      firstName: 'Emma',
      lastName: 'Brown',
      profilePicture: 'https://randomuser.me/api/portraits/women/21.jpg',
      description: 'Community organizer and advocate for social justice.'
    },
    {
      username: 'David',
      firstName: 'David',
      lastName: 'Miller',
      profilePicture: 'https://randomuser.me/api/portraits/men/64.jpg',
      description: 'Researcher focused on renewable energy technologies.'
    },
    {
      username: 'Olivia',
      firstName: 'Olivia',
      lastName: 'Davis',
      profilePicture: 'https://randomuser.me/api/portraits/women/54.jpg',
      description: 'Health and wellness coach promoting holistic living.'
    }
  ];
  
  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Sample Users</h2>
      <p className="user-list-instruction">Click on a user to view their profile</p>
      
      <div className="user-list">
        {sampleUsers.map(user => {
          return (
            <Link 
              to={`/profile/${user.username}`} 
              key={user.username} 
              className="user-list-item"
            >
              <div className="user-list-avatar">
                <img 
                  src={user.profilePicture} 
                  alt={`${user.username}'s avatar`} 
                  className="user-avatar-img"
                />
                {Math.random() > 0.7 && <span className="online-indicator"></span>}
              </div>
              <div className="user-list-info">
                <h3 className="user-list-name">{`${user.firstName} ${user.lastName}`}</h3>
                <p className="user-list-username">@{user.username}</p>
                <p className="user-list-description">{user.description.substring(0, 60)}...</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserList; 