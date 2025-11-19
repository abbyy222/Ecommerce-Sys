// src/pages/ECommerceHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ShoppingCart, Heart, Search, Star, Zap, Package, User, Menu, X, Loader } from 'lucide-react';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/authContext';

const ECommerceHome = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  // 💡 Added: Modal control states
const [selectedProduct, setSelectedProduct] = useState(null);
const [showProductModal, setShowProductModal] = useState(false);
const [quantity, setQuantity] = useState(1);

const navigate = useNavigate();

  const categories = [
    { id: 'All', name: 'All Products', icon: '🛍️' },
    { id: 'Electronics', name: 'Electronics', icon: '⚡' },
    { id: 'Fashion', name: 'Fashion', icon: '👔' },
    { id: 'Home & Kitchen', name: 'Home & Kitchen', icon: '🏠' },
    { id: 'Sports', name: 'Sports', icon: '⚽' },
    { id: 'Books', name: 'Books', icon: '📚' },
  ];

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Fetch cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await productService.getProducts({
      q: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      limit: 50
    });
    
    if (result.success) {
      setProducts(result.data.items || []);
    }
    setLoading(false);
  };

  const fetchCart = async () => {
    const result = await cartService.getCart();
    if (result.success && result.data) {
      setCart(result.data.items || []);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      // Redirect to login or show login modal
      return;
    }

    const result = await cartService.addToCart({
      productId: product._id,
      quantity: 1
    });

    if (result.success) {
      fetchCart(); // Refresh cart
      // Trigger animation
      const btn = document.getElementById(`cart-${product._id}`);
      btn?.classList.add('scale-0');
      setTimeout(() => btn?.classList.remove('scale-0'), 300);
    } else {
      alert(result.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    const result = await cartService.removeFromCart(productId);
    if (result.success) {
      fetchCart();
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  // 💡 Added: handle open/close modal
const openProductModal = (product) => {
  setSelectedProduct(product);
  setQuantity(1);
  setShowProductModal(true);
};

const closeProductModal = () => {
  setShowProductModal(false);
  setSelectedProduct(null);
};


  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.sellingPrice || item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-white/70 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">✨</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Braham's Shop</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-slate-700 hover:text-purple-600 transition-colors font-medium">Home</a>
              <a href="/shop" className="text-slate-700 hover:text-purple-600 transition-colors font-medium">Shop</a>
              <a href="/about" className="text-slate-700 hover:text-purple-600 transition-colors font-medium">About</a>
              <a href="/contact" className="text-slate-700 hover:text-purple-600 transition-colors font-medium">Contact</a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-purple-100 transition-colors relative group">
                <Heart className="w-5 h-5 text-slate-700 group-hover:text-pink-500 transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setShowCart(!showCart)}
                className="p-2 rounded-full hover:bg-purple-100 transition-colors relative group"
              >
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {cart.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full shadow-lg">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
              ) : (
                <a href="/login" className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </a>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
                {menuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="/" className="block py-2 text-slate-700 hover:text-purple-600 transition-colors">Home</a>
              <a href="/shop" className="block py-2 text-slate-700 hover:text-purple-600 transition-colors">Shop</a>
              <a href="/about" className="block py-2 text-slate-700 hover:text-purple-600 transition-colors">About</a>
              <a href="/contact" className="block py-2 text-slate-700 hover:text-purple-600 transition-colors">Contact</a>
              {!isAuthenticated && (
                <a href="/login" className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-full text-center">
                  Sign In
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-slate-700">Flash Sale: Up to 50% Off</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Discover Your Style
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Shop the latest trends with exclusive deals and lightning-fast delivery
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-slate-200 focus:border-purple-400 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white shadow-md'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-600 font-semibold">No products found</p>
            <p className="text-slate-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={product._id}
                onClick={() => openProductModal(product)} // 💡 Added: opens modal
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 hover:bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border border-white/60"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animation: 'fadeIn 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Badge */}
                {product.stock <= 10 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Low Stock
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-400 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Sold Out
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      wishlist.includes(product._id) ? 'fill-pink-500 text-pink-500' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="h-48 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {product.images && product.images.length > 0 ? (
                    <img 
                       src={`http://localhost:5000${product.images[0]}`}  
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <Package className="w-20 h-20 text-slate-300" />
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500">{product.category}</p>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₦{product.sellingPrice?.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">Stock: {product.stock}</p>
                    </div>

                    <button
                      id={`cart-${product._id}`}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`p-3 rounded-2xl text-white shadow-lg transform transition-all duration-300 ${
                        product.stock === 0 
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:scale-110'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <ShoppingCart className="w-6 h-6" />
                    <span>Your Cart</span>
                  </h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                <p className="text-purple-100 mt-2">{cart.length} items</p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-slate-600">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const product = item.product || item;
                    const price = product.sellingPrice || item.price || 0;
                    const quantity = item.quantity || 1;
                    
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img   src={`http://localhost:5000${product.images[0]}`}  alt={product.name} className="w-full h-full object-cover"crossOrigin="anonymous" />
                          ) : (
                            <Package className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{product.name}</h3>
                          <p className="text-purple-600 font-bold">₦{price.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Qty: {quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product._id || product.id)}
                          className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t bg-slate-50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-bold text-slate-800">₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600">Shipping:</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₦{cartTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button 
                     onClick={() => navigate('/checkout')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
       {/* 💡 Product Detail Modal */}
{showProductModal && selectedProduct && (
  <>
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={closeProductModal}
    ></div>

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
          <button onClick={closeProductModal} className="hover:bg-white/20 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-2xl overflow-hidden">
            {selectedProduct.images && selectedProduct.images.length > 0 ? (
              <img
                src={`http://localhost:5000${selectedProduct.images[0]}`}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <Package className="w-20 h-20 text-slate-300" />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-slate-600">{selectedProduct.description || 'No description available.'}</p>

            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₦{selectedProduct.sellingPrice?.toLocaleString()}
            </p>

            <p className="text-sm text-slate-500">Stock: {selectedProduct.stock}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-slate-200 rounded-full"
              >−</button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                className="px-3 py-1 bg-slate-200 rounded-full"
              >+</button>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={selectedProduct.stock === 0}
              onClick={async () => {
                if (!isAuthenticated) {
                  alert('Please login to add items to cart');
                  return;
                }
                if (quantity > selectedProduct.stock) {
                  alert('Quantity exceeds available stock');
                  return;
                }

                const result = await cartService.addToCart({
                  productId: selectedProduct._id,
                  quantity
                });

                if (result.success) {
                  fetchCart();
                  closeProductModal();
                  alert('Added to cart successfully!');
                } else {
                  alert(result.message || 'Failed to add to cart');
                }
              }}
              className={`w-full py-3 mt-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                selectedProduct.stock === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-xl'
              }`}
            >
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ECommerceHome;