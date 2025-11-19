import api from './api';

export const riderService = {
  // Create new rider
 async createRider(data) {
  try {
    const response = await api.post('/riders/register', data, {
      headers: { "Content-Type": "application/json" }
    });

    return {
      success: true,
      data: response.data,
      message: 'Rider created successfully'
    };

  } catch (error) {
    console.log("ERROR:", error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || 'Error creating rider'
    };
  }
},

  // Get all riders with filters
  async getAllRiders(params = {}) {
    try {
      const { page = 1, limit = 10, status, isActive } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (status && status !== 'all') queryParams.append('status', status);
      if (isActive !== undefined) queryParams.append('isActive', isActive);

      const response = await api.get(`/riders?${queryParams.toString()}`);
      return {
        success: true,
       riders: response.data.riders,
      count: response.data.count
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching riders'
      };
    }
  },

  // Get single rider by ID
  async getRiderById(id) {
    try {
      const response = await api.get(`/riders/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching rider'
      };
    }
  },

  // Update rider
  async updateRider(id, riderData) {
    try {
      const response = await api.put(`/riders/${id}`, riderData);
      return {
        success: true,
        data: response.data,
        message: 'Rider updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating rider'
      };
    }
  },

  // Delete rider
  async deleteRider(id) {
    try {
      const response = await api.delete(`/riders/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Rider deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting rider'
      };
    }
  },

  // Toggle rider active status
  async toggleRiderStatus(id, isActive) {
    try {
      const response = await api.patch(`/riders/${id}/status`, { isActive });
      return {
        success: true,
        data: response.data,
        message: 'Rider status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating rider status'
      };
    }
  },

  // Get available riders (for assignment)
  async getAvailableRiders() {
    try {
      const response = await api.get('/riders/available');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching available riders'
      };
    }
  },

  // Get rider statistics
  async getRiderStats(riderId) {
    try {
      const response = await api.get(`/riders/${riderId}/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching rider statistics'
      };
    }
  },

  // Get rider's delivery history
  async getRiderDeliveries(riderId, params = {}) {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (status && status !== 'all') queryParams.append('status', status);

      const response = await api.get(`/riders/${riderId}/deliveries?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching rider deliveries'
      };
    }
  },

  // Update rider location (for live tracking)
  async updateRiderLocation(riderId, location) {
    try {
      const response = await api.patch(`/riders/${riderId}/location`, location);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating rider location'
      };
    }
  },

  // Get all riders statistics (Admin dashboard)
  async getAllRidersStats() {
    try {
      const response = await api.get('/riders/stats/overview');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching riders statistics'
      };
    }
  },



  // Assign rider to order with delivery date
  async assignRiderToOrder(orderId, riderId, deliveryDate) {
    try {
      const response = await api.post(`/orders/${orderId}/assign-rider`, {
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
  }
};