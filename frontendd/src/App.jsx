import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
// Uncomment when you create these components
import { ProtectedRoute, AdminRoute } from './components/protectedRoutes';

import Login from './pages/Login';
import Register from './pages/Register';
import  CheckoutPage  from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Import other pages as we create them
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
import UserDashboard from './pages/home';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/ProductAdd';
import ViewOrders from './pages/admin/ViewOrders';
import RiderPagee from './pages/admin/RiderPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
          {/* <Route path="/cart" element={<Cart />} /> */}
          
          {/* USER ROUTES (Protected) */}
         <Route 
              path="/home" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          /> 
           <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
                <OrderSuccessPage/>
              </ProtectedRoute>
            } 
          /> 
           <Route 
            path="/admin/productAdd"  
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } 
          /> 
          {/* <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            } 
          /> */}
          
          {/* ADMIN ROUTES (Protected + Admin Only) */}
           <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          /> 
          <Route 
            path="/admin/ViewOrders" 
            element={
              <AdminRoute>
                <ViewOrders />
              </AdminRoute>
            } 
          /> 
           <Route 
            path="/admin/RiderPage" 
            element={
              <AdminRoute>
                <RiderPagee />
              </AdminRoute>
            } 
          /> 
          
          {/* 404 - NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Simple 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🔍</div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span>← Back to Home</span>
        </a>
      </div>
    </div>
  );
};

export default App;