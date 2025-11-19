import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Truck, Calendar, X, Package, MapPin, Phone, Mail, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';

const AdminViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await orderService.getAllOrders({ 
      status: statusFilter === 'all' ? undefined : statusFilter 
    });
     console.log("RESPONSE DATA:", result.data);
    if (result.success) {
      setOrders(result.data || []);
    }
    setLoading(false);
  };

  // Filter orders by search
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedOrder) return;
    
    const result = await orderService.updateOrderStatus(selectedOrder._id, newStatus, statusNotes);
    if (result.success) {
      await fetchOrders();
      setShowStatusModal(false);
      setStatusNotes('');
      alert('Order status updated successfully!');
    } else {
      alert(result.message);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-gradient-to-r from-amber-600 to-orange-600',
      Processing: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      Shipped: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      Delivered: 'bg-gradient-to-r from-emerald-600 to-green-600',
      Cancelled: 'bg-gradient-to-r from-red-600 to-rose-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${styles[status] || 'bg-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Orders Management
        </h1>
        <p className="text-gray-400 text-sm">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, gradient: 'from-purple-600 to-indigo-600' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: Clock, gradient: 'from-amber-600 to-orange-600' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length, icon: Truck, gradient: 'from-blue-600 to-cyan-600' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle, gradient: 'from-emerald-600 to-green-600' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 text-white opacity-80" />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 mb-6 shadow-xl border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      <span className="ml-3">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr key={order._id} className="border-t border-slate-700 hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4 text-sm text-purple-300 font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{order.user?.name || 'N/A'}</p>
                        <p className="text-gray-400 text-xs">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">
                      ₦{order.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setShowStatusModal(true);
                          }}
                          className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
                          title="Update Status"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Order ID</p>
                  <p className="text-white font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" /> Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><span className="text-gray-400">Name:</span> {selectedOrder.user?.name}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Email:</span> {selectedOrder.user?.email}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Phone:</span> {selectedOrder.user?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                      <div>
                        <p className="text-white font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-emerald-400 font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-lg font-semibold">Total Amount</span>
                  <span className="text-white text-2xl font-bold">₦{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-md w-full border border-slate-700 shadow-2xl">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Update Order Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Notes (Optional)</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewOrders;