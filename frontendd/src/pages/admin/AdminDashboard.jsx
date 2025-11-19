import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; 

import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const AdminDashboardHome = () => {
  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    totalRevenue: 245680,
    totalOrders: 1234,
    totalProducts: 456,
    totalCustomers: 890,
    pendingOrders: 45,
    activeRiders: 12
  });

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 1250, status: 'Delivered', rider: 'Mike Johnson', time: '2 mins ago' },
    { id: '#ORD-002', customer: 'Sarah Smith', amount: 890, status: 'In Transit', rider: 'Alex Brown', time: '15 mins ago' },
    { id: '#ORD-003', customer: 'David Lee', amount: 2340, status: 'Pending', rider: 'Not Assigned', time: '1 hour ago' },
    { id: '#ORD-004', customer: 'Emma Wilson', amount: 670, status: 'Delivered', rider: 'Chris Davis', time: '3 hours ago' },
  ];

  const salesData = [
    { day: 'Mon', sales: 4200 },
    { day: 'Tue', sales: 3800 },
    { day: 'Wed', sales: 5100 },
    { day: 'Thu', sales: 4600 },
    { day: 'Fri', sales: 6200 },
    { day: 'Sat', sales: 7800 },
    { day: 'Sun', sales: 5400 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'In Transit': return 'bg-sky-100 text-sky-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, trend }) => (
    <div className="group relative bg-gradient-to-br from-red-300 to-purple-500 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/60 overflow-hidden">
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${
            title.includes('Revenue') ? 'from-emerald-400 to-teal-600' :
            title.includes('Orders') ? 'from-sky-400 to-indigo-600' :
            title.includes('Products') ? 'from-violet-400 to-purple-600' :
            title.includes('Customers') ? 'from-orange-400 to-rose-600' :
            title.includes('Pending') ? 'from-amber-400 to-orange-600' :
            'from-cyan-400 to-blue-600'
          } shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{change}%</span>
          </div>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          {title.includes('Revenue') ? `₦${value.toLocaleString()}` : value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Static Curved Wave - Behind Everything */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
          <path 
            d="M0,320 Q360,180 720,320 T1440,320 L1440,0 L0,0 Z" 
            fill="url(#waveGradient)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7"/>
              <stop offset="50%" stopColor="#EC4899" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Static Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-300/40 to-rose-300/40 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
            Admin Dashboard
          </h1>
          <p className="text-slate-700 text-base sm:text-lg font-medium">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <StatCard icon={DollarSign} title="Total Revenue" value={stats.totalRevenue} change={12.5} trend="up" />
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <StatCard icon={ShoppingCart} title="Total Orders" value={stats.totalOrders} change={8.2} trend="up" />
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <StatCard icon={Package} title="Total Products" value={stats.totalProducts} change={3.1} trend="up" />
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <StatCard icon={Users} title="Total Customers" value={stats.totalCustomers} change={15.7} trend="up" />
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <StatCard icon={Clock} title="Pending Orders" value={stats.pendingOrders} change={2.3} trend="down" />
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <StatCard icon={Truck} title="Active Riders" value={stats.activeRiders} change={5.4} trend="up" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Weekly Sales</h2>
              <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                View Report
              </button>
            </div>
            
            <div className="flex items-end justify-between space-x-2 sm:space-x-3 h-48 sm:h-64">
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <div 
                      className="w-full bg-gradient-to-t from-violet-500 via-fuchsia-500 to-sky-500 rounded-t-2xl transition-all duration-500 hover:scale-110 cursor-pointer relative overflow-hidden shadow-lg hover:shadow-2xl"
                      style={{ height: `${(data.sales / maxSales) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
                        ₦{data.sales.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold text-slate-700">{data.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white/95 to-pink-50/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { icon: Package, label: 'Add Product', color: 'from-purple-500 to-pink-500', path: '/admin/productAdd' },
              { icon: ShoppingCart, label: 'View Orders', color: 'from-blue-500 to-indigo-500', path: '/admin/ViewOrders' },
              { icon: Truck, label: 'Add Rider', color: 'from-cyan-500 to-blue-500', path: '/admin/RiderPage' },
              { icon: Users, label: 'View Customers', color: 'from-orange-500 to-red-500', path: '/admin/customers' },
              ].map((action, index) => (
                <button
                  key={index}
                      onClick={() => navigate(action.path)}
                  className="w-full group relative bg-gradient-to-r from-white to-purple-50/50 hover:from-purple-50 hover:to-pink-50 p-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-purple-200/50 hover:border-purple-400/70"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gradient-to-br from-white/95 to-indigo-50/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Recent Orders</h2>
            <button className="text-purple-600 font-bold hover:text-purple-700 transition-colors hover:scale-105 inline-flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-6 sm:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Order ID</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Customer</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Amount</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Status</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Rider</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Time</th>
                    <th className="text-left py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-purple-50/70 hover:to-pink-50/70 transition-all duration-300"
                    >
                      <td className="py-4 px-2 sm:px-4 font-bold text-violet-600 text-xs sm:text-base whitespace-nowrap">{order.id}</td>
                      <td className="py-4 px-2 sm:px-4 text-slate-700 font-medium text-xs sm:text-base whitespace-nowrap">{order.customer}</td>
                      <td className="py-4 px-2 sm:px-4 font-bold text-slate-900 text-xs sm:text-base whitespace-nowrap">₦{order.amount.toLocaleString()}</td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-slate-700 text-xs sm:text-base whitespace-nowrap">{order.rider}</td>
                      <td className="py-4 px-2 sm:px-4 text-slate-500 text-xs sm:text-sm whitespace-nowrap">{order.time}</td>
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button className="p-1.5 sm:p-2 hover:bg-sky-100 rounded-xl transition-all hover:scale-110 group">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-sky-600" />
                          </button>
                          <button className="p-1.5 sm:p-2 hover:bg-violet-100 rounded-xl transition-all hover:scale-110 group">
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-violet-600" />
                          </button>
                          <button className="p-1.5 sm:p-2 hover:bg-rose-100 rounded-xl transition-all hover:scale-110 group">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Animations */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default AdminDashboardHome;