import React from 'react';
import { Link } from 'react-router-dom';
import { getAllUsernames, getUserByUsername, formatFullName } from '../../utils/userDataUtils';
import './userList.css';

const UserList = () => {
  const usernames = getAllUsernames();
  
  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Sample Users</h2>
      <p className="user-list-instruction">Click on a user to view their profile</p>
      
      <div className="user-list">
        {usernames.map(username => {
          const userData = getUserByUsername(username);
          return (
            <Link 
              to={`/profile/${username}`} 
              key={username} 
              className="user-list-item"
            >
              <div className="user-list-avatar">
                <img 
                  src={userData.profilePicture} 
                  alt={`${username}'s avatar`} 
                  className="user-avatar-img"
                />
                {Math.random() > 0.7 && <span className="online-indicator"></span>}
              </div>
              <div className="user-list-info">
                <h3 className="user-list-name">{formatFullName(userData)}</h3>
                <p className="user-list-username">@{username}</p>
                <p className="user-list-description">{userData.description.substring(0, 60)}...</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserList; 