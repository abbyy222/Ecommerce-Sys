// src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, Package, Phone, Mail, MapPin, Calendar,
  Home, FileText, Sparkles, Truck
} from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const { orderId, orderData } = location.state || {};

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">No order found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full">
          {/* Success Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
            {/* Header with animation */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-bounce-slow shadow-2xl">
                <CheckCircle className="w-16 h-16 text-emerald-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Order Placed Successfully! 🎉
              </h1>
              <p className="text-white/90 text-lg">
                Thank you for your purchase! We'll contact you shortly.
              </p>
            </div>

            {/* Order Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Order ID */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Order ID</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      #{orderId?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-emerald-500" />
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">What Happens Next?</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">1.</span>
                        <span>Our team will contact you via phone/email for payment confirmation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">2.</span>
                        <span>Once payment is confirmed, we'll prepare your order</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">3.</span>
                        <span>You'll receive tracking updates via SMS/email</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">4.</span>
                        <span>Your order will be delivered within 2-3 business days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span>Order Summary</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Amount */}
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-800">
                      ₦{orderData?.totalAmount?.toLocaleString()}
                    </p>
                  </div>

                  {/* Delivery Method */}
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Delivery Method</p>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-purple-600" />
                      <p className="font-bold text-slate-800 capitalize">
                        {orderData?.deliveryInfo?.deliveryMethod || 'Standard Delivery'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="font-bold text-slate-800 mb-4">Your Contact Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Phone</p>
                        <p className="font-semibold text-slate-800">{orderData?.deliveryInfo?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Email</p>
                        <p className="font-semibold text-slate-800">{orderData?.deliveryInfo?.email}</p>
                      </div>
                    </div>

                    {orderData?.deliveryInfo?.address && orderData.deliveryInfo.address !== 'Store Pickup' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Delivery Address</p>
                          <p className="font-semibold text-slate-800">
                            {orderData.deliveryInfo.address}, {orderData.deliveryInfo.city}, {orderData.deliveryInfo.state}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  <span>Continue Shopping</span>
                </button>

                <button
                  onClick={() => navigate('/my-orders')}
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-purple-300 text-purple-600 py-4 rounded-2xl font-bold hover:bg-purple-50 hover:scale-105 transition-all duration-300"
                >
                  <Package className="w-5 h-5" />
                  <span>View My Orders</span>
                </button>
              </div>

              {/* Support Info */}
              <div className="text-center pt-6 border-t border-slate-200">
                <p className="text-slate-600 mb-2">Need help with your order?</p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <a href="tel:+2348012345678" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>Call Us</span>
                  </a>
                  <span className="text-slate-400">|</span>
                  <a href="mailto:support@luxeshop.com" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Animation */}
      <style>{`
        @keyframes confetti {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(100vh) rotate(720deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;