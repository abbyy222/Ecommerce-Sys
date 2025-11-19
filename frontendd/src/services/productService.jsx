import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    try {
      const { q, category, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      
      if (q!==undefined&& q!==null && q!== '') queryParams.append('q', q);
      if (category && category !== 'All') queryParams.append('category', category);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      const response = await api.get(`/products?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching products'
      };
    }
  },

  // Get single product
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching product'
      };
    }
  },

  // Create product
  async createProduct(formData) {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // CRITICAL FOR FILE UPLOAD
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Product created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating product'
      };
    }
  },

  // Update product
  async updateProduct(id, formData) {
    try {
       const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // CRITICAL FOR FILE UPLOAD
        },
      });
      return {
        success: true,
        data: response.data,
        message: 'Product updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating product'
      };
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting product'
      };
    }
  },

  // Update stock only
  async updateStock(id, stock) {
    try {
      const response = await api.patch(`/products/${id}/stock`, { stock });
      return {
        success: true,
        data: response.data,
        message: 'Stock updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating stock'
      };
    }
  },

  // Get product statistics
  async getProductStats() {
    try {
      const response = await api.get('/products/stats/overview');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching statistics'
      };
    }
  },

  // Get low stock products
  async getLowStockProducts(threshold = 10) {
    try {
      const response = await api.get(`/products/alerts/low-stock?threshold=${threshold}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching low stock products'
      };
    }
  }
};