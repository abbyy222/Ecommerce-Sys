// src/pages/Login.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShoppingBag } from 'lucide-react';

// Move animations to external CSS file or remove expensive ones
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use useCallback to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    setError('');
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e) => {
    
    e.preventDefault();
    console.log("Submitting:", formData);
   
    
    // Early validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Use setTimeout to break up the work
        setTimeout(() => {
          if (result.data.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        }, 0);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, login, navigate]);

  // Redirect if already logged in - memoize this effect
  React.useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Memoize form inputs to prevent re-renders
  const emailInput = useMemo(() => (
    <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-300"
        />
      </div>
    </div>
  ), [formData.email, handleChange]);

  const passwordInput = useMemo(() => (
    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors hover:scale-110"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  ), [formData.password, showPassword, handleChange]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* SIMPLIFIED Background - Remove expensive blobs and particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo - removed bounce animation */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <Sparkles className="w-10 h-10 text-purple-600 transition-all duration-300" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Braham's Store
            </span>
          </Link>
        </div>

        {/* Login Card - Reduced backdrop blur and removed expensive effects */}
        <div className="bg-white/95 rounded-3xl shadow-xl p-8 border border-white/30">
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Sign in to continue shopping</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {emailInput}
            {passwordInput}

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-pink-600 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Simplified Social Login */}
          <div className="space-y-3">
            <button 
              type="button"
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              </svg>
              <span className="font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-purple-600 hover:text-pink-600 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-purple-600 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);