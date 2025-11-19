// src/services/authService.js
import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
       console.log('🔍 Login API response:', response.data);
      
      return { success: true, data: response.data.user };
    } catch (error) {
         console.log('🔍 Login API error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  // Get current user info
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, data: response.data.user || response.data };
    } catch (error) {
      return { success: false, data: null };
    }
  },
};