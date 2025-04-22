import sampleUsers from '../data/sampleUsers.json';

/**
 * Get user data from the sample data based on username
 * In a real app, this would fetch from an API
 * 
 * @param {string} username - The username to look up
 * @returns {object} The user data object
 */
export const getUserByUsername = (username) => {
  if (!username) return null;
  
  const user = sampleUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
  return user || null;
};

/**
 * Get a list of all usernames for testing
 * 
 * @returns {array} Array of usernames
 */
export const getAllUsernames = () => {
  return sampleUsers.map(user => user.username);
};

/**
 * Format a user's full name from user data
 * 
 * @param {object} user - The user data object
 * @returns {string} Formatted full name
 */
export const formatFullName = (user) => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
};

/**
 * Format education information from user data
 * 
 * @param {object} user - The user data object
 * @returns {string} Formatted education string
 */
export const formatEducation = (user) => {
  if (!user || !user.education) return '';
  
  if (user.education.status && user.education.institution) {
    return `${user.education.status} at ${user.education.institution}`;
  } else if (user.education.institution) {
    return `Attends ${user.education.institution}`;
  }
  
  return '';
};

/**
 * Format location information from user data
 * 
 * @param {object} user - The user data object
 * @returns {string} Formatted location string
 */
export const formatLocation = (user) => {
  if (!user) return '';
  
  if (user.city && user.country) {
    return `${user.city}, ${user.country}`;
  } else if (user.city) {
    return user.city;
  } else if (user.country) {
    return user.country;
  }
  
  return '';
}; 