import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders/create', orderData);
      return {
        success: true,
        data: response.data,
        message: 'Order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating order'
      };
    }
  },

  // Get user's orders
  async getMyOrders(params = {}) {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (status && status !== 'all') queryParams.append('status', status);

      const response = await api.get(`/orders/my-orders?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching orders'
      };
    }
  },

  // Get single order by ID
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching order'
      };
    }
  },

  // Cancel order (customer side)
  async cancelOrder(id, reason) {
    try {
      const response = await api.patch(`/orders/${id}/cancel`, { reason });
      return {
        success: true,
        data: response.data,
        message: 'Order cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error cancelling order'
      };
    }
  },

  // ==================== ADMIN ENDPOINTS ====================

  // Get all orders (Admin only)
  async getAllOrders(params = {}) {
    try {
      const { page = 1, limit = 10, status, q } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (status && status !== 'all') queryParams.append('status', status);
      if (q !== undefined && q !== null && q !== '') queryParams.append('q', q);

      const response = await api.get(`/orders/admin?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data.orders
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching orders'
      };
    }
  },

  // Update order status (Admin only)
  async updateOrderStatus(id, status, notes = '') {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status, notes });
      return {
        success: true,
        data: response.data,
        message: 'Order status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating order status'
      };
    }
  },

  // Assign delivery person (Admin only)
  async assignDelivery(orderId, riderId, deliveryDate) {
    try {
      const response = await api.patch(`/orders/${orderId}/assignRider`, {
        riderId,
        deliveryDate
      });
      return {
        success: true,
        data: response.data,
        message: 'Rider assigned successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error assigning rider to order'
      };
    }
  },

  // Get order statistics (Admin only)
  async getOrderStats() {
    try {
      const response = await api.get('/orders/stats/overview');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching order statistics'
      };
    }
  },

  // Get revenue analytics (Admin only)
  async getRevenueAnalytics(params = {}) {
    try {
      const { startDate, endDate, period = 'daily' } = params;
      const queryParams = new URLSearchParams();
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      queryParams.append('period', period);

      const response = await api.get(`/orders/stats/revenue?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching revenue analytics'
      };
    }
  },

    //Get PendingOrders List 
  async getPendingOrdersList() {
  try {
    const response = await api.get("/orders/pendingOrder");
    return {
      success: true,
      data: response.data.orders,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error fetching pending orders list"
    };
  }
},

  // Get pending orders count (Admin only)
  async getPendingOrdersCount() {
    try {
      const response = await api.get('/orders/Pend');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching pending orders count'
      };
    }
  }
};