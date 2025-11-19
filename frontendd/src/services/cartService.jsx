// src/services/cartService.js
import api from './api';

export const cartService = {
  // Add item to cart
  addToCart: async (data) => {
    try {
      const response = await api.post('/cart/add', data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  },

  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch cart',
      };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  },

  // Update item quantity
  updateQuantity: async (data) => {
    try {
      const response = await api.put('/cart/update', data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity',
      };
    }
  },
};