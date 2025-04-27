import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth-token', response.data.token);
    }
    return response.data;
  },
  
  verifyToken: async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;
    
    try {
      const response = await api.get('/login/verify');
      return response.data;
    } catch (error) {
      localStorage.removeItem('auth-token');
      throw error;
    }
  },
  
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth-token');
  }
};

// User API
export const userAPI = {
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  getFriends: async (userId) => {
    // Get user data which includes populated friends
    const response = await api.get(`/users/${userId}`);
    // Return just the friends array from the user data
    return response.data.friends || [];
  },
  
  addFriend: async (userId) => {
    const response = await api.put(`/users/${userId}/friend`);
    return response.data;
  },
  
  removeFriend: async (userId) => {
    const response = await api.put(`/users/${userId}/unfriend`);
    return response.data;
  }
};

// Post API
export const postAPI = {
  getPosts: async (userId) => {
    const endpoint = userId ? `/posts/user/${userId}` : '/posts/timeline';
    const response = await api.get(endpoint);
    return response.data;
  },
  
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },
  
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
  
  likePost: async (postId) => {
    const response = await api.put(`/posts/${postId}/like`);
    return response.data;
  }
};

// Export the axios instance for any custom needs
export default api; 