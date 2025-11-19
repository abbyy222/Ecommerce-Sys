// src/pages/admin/AdminProductsManagement.jsx
import React, { useState, useEffect } from 'react';
import AddProductModal from './addProductModal';
import { 
  Plus, Search, Filter, Edit, Trash2, Package,
  TrendingUp, AlertCircle, DollarSign, Tag, Box, Loader
} from 'lucide-react';
import { productService } from '../../services/productService';

const AdminProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct]= useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books'];

  const fetchProducts = async () => {
    setLoading(true);
    const result = await productService.getProducts({
      q: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      page: pagination.page,
      limit: 12
    });

    if (result.success) {
      setProducts(result.data.items || []);
      setPagination({
        page: result.data.page || 1,
        pages: result.data.pages || 1,
        total: result.data.total || 0
      });
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const result = await productService.getProductStats();
    if (result.success) setStats(result.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [searchQuery, selectedCategory, pagination.page]);

  // Create product callback (called by modal)
  const handleCreateProduct = async (formData, imageFiles) => {
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    imageFiles.forEach(file => submitData.append('images', file));

    const result = await productService.createProduct(submitData);

    if (result.success) {
      alert('Product created successfully!');
      setShowAddModal(false);
      fetchProducts();
      fetchStats();
    } else {
      alert(result.message || 'Failed to create product');
    }
  };
const handleUpdateProduct = async (id, formData, imageFiles) => {
  const submitData = new FormData();
  Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
  imageFiles.forEach(file => submitData.append('images', file));

  const result = await productService.updateProduct(id, submitData);

  if (result.success) {
    alert('Product updated successfully!');
    setShowAddModal(false);
    setEditingProduct(null);
    fetchProducts();
    fetchStats();
  } else {
    alert(result.message || 'Failed to update product');
  }
};

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const result = await productService.deleteProduct(id);
    if (result.success) {
      alert('Product deleted successfully!');
      fetchProducts();
      fetchStats();
    } else {
      alert(result.message || 'Failed to delete product');
    }
  };

  const getStatusInfo = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', gradient: 'from-red-400 to-pink-600' };
    if (stock <= 10) return { text: 'Low Stock', gradient: 'from-yellow-400 to-orange-600' };
    return { text: 'In Stock', gradient: 'from-green-400 to-emerald-600' };
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 flex items-center space-x-3 sm:space-x-4">
          <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
          </div>
          <span>Products Management</span>
        </h1>
        <p className="text-white/80 text-base sm:text-lg">Manage your entire product catalog with ease</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          </div>
          <p className="text-white/90 font-semibold text-sm sm:text-base mb-1">Total Products</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">{stats.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Box className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          </div>
          <p className="text-white/90 font-semibold text-sm sm:text-base mb-1">In Stock</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">{stats.inStock}</p>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          </div>
          <p className="text-white/90 font-semibold text-sm sm:text-base mb-1">Low Stock</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">{stats.lowStock}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
          </div>
          <p className="text-white/90 font-semibold text-sm sm:text-base mb-1">Total Value</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">₦{stats.totalValue?.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 mb-8 shadow-xl border border-white/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-xl border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2 lg:pb-0">
            <Filter className="w-5 h-5 text-white flex-shrink-0" />
            <div className="flex space-x-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-white text-purple-600 shadow-lg scale-105' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-12 h-12 text-white animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-20 h-20 text-white/50 mx-auto mb-4" />
          <p className="text-2xl text-white font-semibold">No products found</p>
          <p className="text-white/70">Add your first product to get started!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => {
              const statusInfo = getStatusInfo(product.stock);
              return (
                <div 
                  key={product._id}
                  className="group relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/30"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-white/20">
                    {product.images && product.images.length > 0 ? (
                     <img 
                         src={`http://localhost:5000${product.images[0]}`} 
                           alt={product.name}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                             crossOrigin="anonymous"
                   />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 sm:w-20 sm:h-20 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div className={`absolute top-4 left-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${statusInfo.gradient} text-white font-bold text-xs sm:text-sm shadow-lg`}>
                      {statusInfo.text}
                    </div>

                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                          onClick={()=> {
                            setEditingProduct(product);
                            setShowAddModal(true);
                          }}
                      className="p-2 bg-white/90 backdrop-blur-xl rounded-full hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 bg-white/90 backdrop-blur-xl rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{product.name}</h3>
                        <p className="text-white/70 text-sm flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{product.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/70 text-sm mb-1">Price</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">₦{product.sellingPrice?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm mb-1">Stock</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{product.stock}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <p className="text-white/70 text-sm">SKU: {product.sku}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              <span className="text-white font-semibold">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showAddModal && (
       <AddProductModal
          setShowAddModal={setShowAddModal}
           categories={categories}
           handleCreateProduct={handleCreateProduct}
           editingProduct={editingProduct}
          handleUpdateProduct={handleUpdateProduct}
      />
      )}

    </div>
  );
};

export default AdminProductsManagement;