import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
  withCredentials: true, // Important! Sends cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (runs before every request)
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (runs after every response)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api;
