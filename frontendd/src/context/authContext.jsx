// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const result = await authService.getMe();
    if (result.success && result.data) {
      setUser(result.data);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    if (result.success) {
      setUser(result.data);
    }
    return result;
  };

  const login = async (credentials) => {
    console.log('🔍 AuthContext login called with:', credentials)
    const result = await authService.login(credentials);
    if (result.success) {
    console.log('🔍 AuthContext login called with:', credentials)
      setUser(result.data);
    }
    return result;
  };

  const logout = async () => {
    const result = await authService.logout();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};