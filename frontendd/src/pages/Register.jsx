// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles, ShoppingBag } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer', // default and ONLY option now
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/'); // Always go to home (customers only)
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Blobs - Enhanced */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo with bounce animation */}
        <div className="text-center mb-8 animate-bounce-slow">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <Sparkles className="w-10 h-10 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Braham's Store
            </span>
          </Link>
        </div>

        {/* Register Card with slide-in animation */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30 animate-slide-up hover:shadow-purple-500/20 transition-all duration-500">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-bl-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-tr-3xl opacity-20"></div>

          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg animate-pulse">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Braham's Store</h2>
            <p className="text-gray-600">Create your account and start shopping!</p>
          </div>

          {/* Error Message with shake animation */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-300"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
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

            {/* Password Input */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
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

            {/* Confirm Password Input */}
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-purple-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors hover:scale-110"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Register Button with animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 animate-fade-in-up bg-[length:200%_auto] hover:bg-right"
              style={{animationDelay: '0.5s'}}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider with animation */}
          <div className="relative my-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Quick Start</span>
            </div>
          </div>

          {/* Sign In Link with animation */}
          <div className="text-center animate-fade-in" style={{animationDelay: '0.7s'}}>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 inline-block"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home with animation */}
        <div className="text-center mt-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <Link
            to="/"
            className="text-gray-600 hover:text-purple-600 transition-colors font-medium inline-flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Register;