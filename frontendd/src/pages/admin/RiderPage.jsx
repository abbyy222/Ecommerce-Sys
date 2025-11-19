import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Save, Truck, Phone, Mail, MapPin, CheckCircle, Clock, AlertCircle, User, Calendar } from 'lucide-react';
import { riderService } from '../../services/riderService';
import { orderService } from '../../services/orderService';

const AdminManageRiders = () => {
  const [riders, setRiders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); 
  const [statusFilter, setStatusFilter] = useState("all");
   const [total, setTotal] = useState(0);
   const [pendingCount, setPendingCount] = useState(0);

  const [activeFilter, setActiveFilter] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    address: ''
  });

  // Fetch riders (placeholder - replace with actual API)
  useEffect(() => {
    fetchRiders();
    fetchPendingOrders();
  }, []);

  const fetchRiders = async () => {
  setLoading(true);

  const result = await riderService.getAllRiders({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    isActive: activeFilter, // optional
  });

  if (result.success) {
    console.log("RIDERS RESPONSE:", result.data);
    setRiders(result.riders || []);   // Make sure your backend returns { riders: [...] }
    setTotal(result.count || 0);      // Optional: for pagination
  } else {
    console.error(result.message);
  }

  setLoading(false);
};

  const fetchPendingOrders = async () => {
    setLoading(true);

  const result = await orderService.getPendingOrdersList();

  if (result.success) {
    console.log("PENDING ORDERS LIST:", result.data);
    setOrders(result.data);   // 👈 now this is real orders
  } else {
    console.error(result.message);
  }

  setLoading(false);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRider = async (formData) => {
      console.log("Sending to backend:", formData);
   
    
    const result = await riderService.createRider(formData);

    if (result.success) {
      alert('Product created successfully!');
      setShowAddModal(false);
      fetchRiders();
      fetchStats();
    } else {
      alert(result.message || 'Failed to create product');
    }
  };

  const handleUpdateRider = async () => {
    // TODO: Replace with actual API call
    // const result = await riderService.updateRider(selectedRider._id, formData);
    console.log('Updating rider:', formData);
    alert('Rider updated successfully! (Connect to backend API)');
    setShowEditModal(false);
    resetForm();
    fetchRiders();
  };

  const handleDeleteRider = async (riderId) => {
    if (!confirm('Are you sure you want to delete this rider?')) return;
    // TODO: Replace with actual API call
    // const result = await riderService.deleteRider(riderId);
    console.log('Deleting rider:', riderId);
    alert('Rider deleted! (Connect to backend API)');
    fetchRiders();
  };

  const handleAssignRider = async () => {
     if (!selectedRider || !selectedOrder) return;

  const deliveryDate = new Date(); // or from UI

  const result = await orderService.assignDelivery(
    selectedOrder._id,
    selectedRider._id,
    deliveryDate
  );

  if (result.success) {
    alert("Rider assigned successfully!");

    setShowAssignModal(false);
    fetchPendingOrders();   // refresh list
  } else {
    alert(result.message);
  }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicleType: '',
      vehicleNumber: '',
      licenseNumber: '',
      address: ''
    });
  };

  const openEditModal = (rider) => {
    setSelectedRider(rider);
    setFormData({
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicleType: rider.vehicleType,
      vehicleNumber: rider.vehicleNumber,
      licenseNumber: rider.licenseNumber || '',
      address: rider.address || ''
    });
    setShowEditModal(true);
  };

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phone.includes(searchQuery)
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      'Available': 'bg-gradient-to-r from-emerald-600 to-green-600',
      'On Delivery': 'bg-gradient-to-r from-blue-600 to-cyan-600',
      'Offline': 'bg-gradient-to-r from-gray-600 to-slate-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${styles[status] || 'bg-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Rider Management
          </h1>
          <p className="text-gray-400 text-sm">Manage delivery riders and assign orders</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Rider
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Riders', value: riders.length, icon: Truck, gradient: 'from-cyan-600 to-blue-600' },
          { label: 'Available', value: riders.filter(r => r.status === 'Available').length, icon: CheckCircle, gradient: 'from-emerald-600 to-green-600' },
          { label: 'On Delivery', value: riders.filter(r => r.status === 'On Delivery').length, icon: Clock, gradient: 'from-amber-600 to-orange-600' },
          { label: 'Pending Orders',  value: pendingCount,  icon: AlertCircle, gradient: 'from-purple-600 to-pink-600' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 text-white opacity-80" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 mb-6 shadow-xl border border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-900 to-blue-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Vehicle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Deliveries</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Active</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                      <span className="ml-3">Loading riders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No riders found</p>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider._id} className="border-t border-slate-700 hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{rider.name}</p>
                          <p className="text-gray-400 text-xs">{rider.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-400" />
                        {rider.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{rider.vehicleType}</p>
                        <p className="text-gray-400 text-xs">{rider.vehicleNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={rider.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-emerald-400 font-semibold">{rider.completedDeliveries} completed</p>
                        <p className="text-gray-400">{rider.totalDeliveries} total</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rider.isActive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
                        {rider.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(rider)}
                          className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all"
                          title="Edit Rider"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRider(rider);
                            setShowAssignModal(true);
                          }}
                          className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
                          title="Assign Order"
                          disabled={rider.status !== 'Available'}
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRider(rider._id)}
                          className="p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all"
                          title="Delete Rider"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Rider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-blue-900 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Add New Rider</h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08012345678"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Vehicle Type *</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bike">Bike</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Vehicle Number *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    placeholder="ABC123"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">LicenceNumber</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="ABC123"
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter rider's address..."
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <button
                onClick={()=>handleAddRider(formData)}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Add Rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rider Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-blue-900 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Edit Rider</h2>
              <button
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Vehicle Type *</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bike">Bike</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Vehicle Number *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <button
                onClick={handleUpdateRider}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Update Rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Order Modal */}
      {showAssignModal && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-blue-900 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Assign Order to {selectedRider.name}</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-300 mb-4">Select an order to assign to this rider:</p>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending orders available</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedOrder?._id === order._id
                          ? 'border-cyan-500 bg-slate-700'
                          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-gray-400 text-sm">{order.user.name}</p>
                        </div>
                        <span className="text-emerald-400 font-bold">₦{order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{order.items.length} items</span>
                        <span>•</span>
                        <span>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAssignRider}
                disabled={!selectedOrder}
                className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  selectedOrder
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Truck className="w-5 h-5" />
                Assign Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageRiders;