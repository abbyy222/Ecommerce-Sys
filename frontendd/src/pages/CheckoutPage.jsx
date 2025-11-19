// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, MapPin, Phone, Mail, User, Calendar, 
  Truck, Package, MessageSquare, CreditCard, Check,
  ChevronRight, Home, ArrowLeft, Loader, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    deliveryMethod: 'delivery', // 'delivery' or 'pickup'
    deliveryDate: '',
    specialInstructions: ''
  });
  
  const [errors, setErrors] = useState({});

  const deliveryOptions = [
    { 
      id: 'delivery', 
      name: 'Home Delivery', 
      icon: Truck, 
      price: 2000,
      description: 'Delivered to your doorstep',
      time: '2-3 business days'
    },
    { 
      id: 'pickup', 
      name: 'Store Pickup', 
      icon: Package, 
      price: 0,
      description: 'Pick up from our store',
      time: 'Same day'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchCart();
    
    // Pre-fill user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    setLoading(true);
    const result = await cartService.getCart();
    if (result.success && result.data) {
      setCart(result.data.items || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\d{11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be 11 digits';
    }
    
    if (formData.deliveryMethod === 'delivery') {
      if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.product?.sellingPrice || item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  const getDeliveryFee = () => {
    const option = deliveryOptions.find(opt => opt.id === formData.deliveryMethod);
    return option ? option.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryFee();
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmitting(true);

    const orderData = {
      items: cart.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity || 1,
        price: item.product?.sellingPrice || item.price
      })),
      totalAmount: calculateTotal(),
      deliveryInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.deliveryMethod === 'delivery' ? formData.address : 'Store Pickup',
        city: formData.city,
        state: formData.state,
        deliveryMethod: formData.deliveryMethod,
        deliveryFee: getDeliveryFee(),
        deliveryDate: formData.deliveryDate,
        specialInstructions: formData.specialInstructions
      }
    };

    const result = await orderService.createOrder(orderData);

    if (result.success) {
      // Navigate to success page with order details
      navigate('/order-success', { 
        state: { 
          orderId: result.data._id,
          orderData: result.data 
        } 
      });
    } else {
      alert(result.message || 'Failed to create order. Please try again.');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-white/50 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-white/70 mb-8">Add some products to checkout</p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shopping</span>
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-slate-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <User className="w-6 h-6 text-purple-600" />
                <span>Personal Information</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 ${
                      errors.fullName ? 'border-red-400' : 'border-slate-200'
                    } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 ${
                        errors.email ? 'border-red-400' : 'border-slate-200'
                      } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 ${
                        errors.phone ? 'border-red-400' : 'border-slate-200'
                      } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                      placeholder="08012345678"
                      maxLength="11"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Truck className="w-6 h-6 text-purple-600" />
                <span>Delivery Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: option.id }))}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      formData.deliveryMethod === option.id
                        ? 'border-purple-400 bg-purple-50 shadow-lg scale-105'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <option.icon className={`w-8 h-8 ${
                        formData.deliveryMethod === option.id ? 'text-purple-600' : 'text-slate-400'
                      }`} />
                      {formData.deliveryMethod === option.id && (
                        <div className="bg-purple-600 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{option.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{option.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{option.time}</span>
                      <span className="font-bold text-purple-600">
                        {option.price === 0 ? 'FREE' : `₦${option.price.toLocaleString()}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Delivery Address (only if delivery selected) */}
              {formData.deliveryMethod === 'delivery' && (
                <div className="space-y-4 p-6 bg-purple-50/50 rounded-2xl border-2 border-purple-200">
                  <h3 className="font-bold text-slate-800 mb-4">Delivery Address</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white border-2 ${
                        errors.address ? 'border-red-400' : 'border-slate-200'
                      } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                      placeholder="123 Main Street, Apartment 4B"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white border-2 ${
                          errors.city ? 'border-red-400' : 'border-slate-200'
                        } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                        placeholder="Lagos"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white border-2 ${
                          errors.state ? 'border-red-400' : 'border-slate-200'
                        } rounded-xl focus:border-purple-400 focus:outline-none transition-all`}
                        placeholder="Lagos"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Preferred Delivery Date (Optional)</span>
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <span>Special Instructions</span>
              </h2>

              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all resize-none"
                placeholder="Any special delivery instructions? (e.g., 'Leave at the gate', 'Call on arrival')"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-6 sm:p-8 shadow-2xl sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6" />
                <span>Order Summary</span>
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.map((item, idx) => {
                  const product = item.product || item;
                  const price = product.sellingPrice || item.price || 0;
                  const quantity = item.quantity || 1;
                  
                  return (
                    <div key={idx} className="flex items-center space-x-3 bg-white/20 backdrop-blur-xl rounded-2xl p-3">
                      <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-white/70 text-xs">Qty: {quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">₦{(price * quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-white/30">
                <div className="flex justify-between text-white/90">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {getDeliveryFee() === 0 ? 'FREE' : `₦${getDeliveryFee().toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/30">
                  <span>Total</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 mt-6"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <p className="text-white/70 text-xs text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;