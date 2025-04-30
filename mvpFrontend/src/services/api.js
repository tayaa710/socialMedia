import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  // Remove the default Content-Type header to allow proper file uploads
});

// Request interceptor to add auth token and content type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
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
  
  updateProfilePicture: async (userId, imageFile) => {
    // Create a custom event we can use to track analysis progress
    const dispatchAnalysisEvent = (isAnalyzing) => {
      const event = new CustomEvent('imageAnalysisStatus', { 
        detail: { isAnalyzing } 
      });
      window.dispatchEvent(event);
    };
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      
      // When sending the request, dispatch an event indicating analysis has started
      dispatchAnalysisEvent(true);
      
      const response = await api.put(`/users/${userId}/profile-picture`, formData);
      
      // When we get a response, analysis is complete
      dispatchAnalysisEvent(false);
      
      return response.data;
    } catch (error) {
      // If there's an error, make sure we reset the analysis state
      dispatchAnalysisEvent(false);
      
      throw error;
    }
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
  
  getTimeline: async (userId, page = 1, options = {}) => {
    let url = `/timeline/${userId}?page=${page}`;
    
    // Extract limit from options or use default
    const limit = options.limit || 4;
    url += `&limit=${limit}`;
    
    // Add filter settings if provided
    if (options.filterSettings) {
      url += `&filterSettings=${encodeURIComponent(JSON.stringify(options.filterSettings))}`;
    }
    
    // Add excluded tags if provided
    if (options.excludedTags && options.excludedTags.length > 0) {
      url += `&excludedTags=${encodeURIComponent(JSON.stringify(options.excludedTags))}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  createPost: async (postData) => {
    // Create a custom event we can use to track analysis progress
    const dispatchAnalysisEvent = (isAnalyzing) => {
      const event = new CustomEvent('imageAnalysisStatus', { 
        detail: { isAnalyzing } 
      });
      window.dispatchEvent(event);
    };
    
    try {
      // When sending the request, dispatch an event indicating analysis has started
      if (postData.has('image')) {
        dispatchAnalysisEvent(true);
      }
      
      const response = await api.post('/posts', postData);
      
      // When we get a response, analysis is complete
      if (postData.has('image')) {
        dispatchAnalysisEvent(false);
      }
      
      return response.data;
    } catch (error) {
      // If there's an error, make sure we reset the analysis state
      if (postData.has('image')) {
        dispatchAnalysisEvent(false);
      }
      
      // Format validation errors to be more user-friendly
      if (error.response && 
          error.response.status === 400 && 
          error.response.data && 
          error.response.data.reasons) {
        
        // Parse reasons if they're available
        throw error; // Keep the original error with the response data
      }
      
      throw error;
    }
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
    const response = await api.patch(`/posts/${postId}/like`);
    return response.data;
  },
  
  likeComment: async (postId, commentId) => {
    try {
      const response = await api.patch(`/posts/${postId}/comment/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error("Failed to like/unlike comment:", error);
      throw error;
    }
  },
  
  likeReply: async (postId, commentId, replyId) => {
    try {
      const response = await api.patch(`/posts/${postId}/comment/${commentId}/reply/${replyId}/like`);
      return response.data;
    } catch (error) {
      console.error("Failed to like/unlike reply:", error);
      throw error;
    }
  },
  
  addComment: async (postId, commentText) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { comment: commentText });
      return response.data;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  },
  
  addReply: async (postId, commentId, replyText) => {
    try {
      const response = await api.post(`/posts/${postId}/comment/${commentId}/reply`, { reply: replyText });
      return response.data;
    } catch (error) {
      console.error("Failed to add reply:", error);
      throw error;
    }
  },
  
  getComments: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comment`);
      return response.data;
    } catch (error) {
      console.error("Failed to get comments:", error);
      throw error;
    }
  }
};

// Export the axios instance for any custom needs
export default api; 