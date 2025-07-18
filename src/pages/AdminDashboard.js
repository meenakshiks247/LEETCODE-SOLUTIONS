import React, { useState, useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CreditCard, 
  Utensils,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Timer,
  User,
  Leaf,
  Meat
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { orders, getOrderStats, getWeeklyStats, getHourlyStats } = useOrders();
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  const orderStats = getOrderStats();
  const weeklyStats = getWeeklyStats();
  const hourlyStats = getHourlyStats();

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Hourly orders chart data
  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    datasets: [
      {
        label: 'Orders per Hour',
        data: Array.from({ length: 24 }, (_, i) => hourlyStats[i] || 0),
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Weekly trends chart data
  const weeklyChartData = {
    labels: Object.keys(weeklyStats),
    datasets: [
      {
        label: 'Total Orders',
        data: Object.values(weeklyStats).map(day => day.total),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Revenue (₹)',
        data: Object.values(weeklyStats).map(day => day.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Meal type distribution
  const mealTypeData = {
    labels: ['Vegetarian', 'Non-Vegetarian'],
    datasets: [
      {
        data: [orderStats.veg, orderStats.nonVeg],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Get today's orders
  const todayOrders = orders.filter(order => 
    order.createdAt.startsWith(new Date().toISOString().split('T')[0])
  );

  // Recent orders (last 5)
  const recentOrders = todayOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Peak hours analysis
  const peakHour = Object.entries(hourlyStats)
    .reduce((max, [hour, count]) => count > max.count ? { hour, count } : max, { hour: 0, count: 0 });

  // Top customers (students with most orders)
  const customerStats = {};
  orders.forEach(order => {
    if (customerStats[order.userName]) {
      customerStats[order.userName]++;
    } else {
      customerStats[order.userName] = 1;
    }
  });

  const topCustomers = Object.entries(customerStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Orders Today',
      value: orderStats.total,
      icon: Utensils,
      color: 'text-blue-600 bg-blue-100',
      change: '+12% from yesterday',
      changeType: 'positive'
    },
    {
      title: 'Revenue Today',
      value: `₹${orderStats.revenue}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      change: `₹${orderStats.pendingRevenue} pending`,
      changeType: 'neutral'
    },
    {
      title: 'Served Orders',
      value: orderStats.served,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
      change: `${orderStats.total - orderStats.served} pending`,
      changeType: 'neutral'
    },
    {
      title: 'Payment Rate',
      value: `${Math.round((orderStats.paid / orderStats.total) * 100) || 0}%`,
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-100',
      change: `${orderStats.pendingPayments} unpaid`,
      changeType: orderStats.pendingPayments > 0 ? 'negative' : 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Smart Canteen Analytics & Management Overview
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                    <div className="text-sm text-gray-600">{card.title}</div>
                  </div>
                </div>
                <div className={`text-sm ${
                  card.changeType === 'positive' ? 'text-green-600' :
                  card.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {card.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Orders Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hourly Order Distribution</h2>
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="h-64">
              <Bar data={hourlyChartData} options={chartOptions} />
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Peak Hour: {peakHour.hour}:00 ({peakHour.count} orders)
            </div>
          </div>

          {/* Weekly Trends Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Weekly Trends</h2>
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div className="h-64">
              <Line data={weeklyChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Meal Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Meal Preferences</h2>
              <Utensils className="w-5 h-5 text-gray-600" />
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={mealTypeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{orderStats.veg}</span>
                </div>
                <div className="text-sm text-gray-600">Vegetarian</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <Meat className="w-4 h-4 text-red-600" />
                  <span className="font-medium">{orderStats.nonVeg}</span>
                </div>
                <div className="text-sm text-gray-600">Non-Vegetarian</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No recent orders</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{order.userName}</div>
                      <div className="text-sm text-gray-600">{order.collegeId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{order.slot}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'served' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Customers</h2>
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div className="space-y-3">
              {topCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No customer data</p>
                </div>
              ) : (
                topCustomers.map(([customerName, orderCount], index) => (
                  <div key={customerName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="font-medium text-gray-900">{customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">{orderCount}</div>
                      <div className="text-xs text-gray-600">orders</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Ordering Status</span>
                </div>
                <span className="text-blue-800 font-medium">
                  {new Date().getHours() < 10 ? 'Open' : 'Closed'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Orders Served</span>
                </div>
                <span className="text-green-800 font-medium">{orderStats.served}/{orderStats.total}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Pending Payments</span>
                </div>
                <span className="text-yellow-800 font-medium">₹{orderStats.pendingRevenue}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Utensils className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Available Slots</span>
                </div>
                <span className="text-purple-800 font-medium">{200 - orderStats.total}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                <Calendar className="w-5 h-5" />
                <span>Schedule Maintenance</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                <AlertCircle className="w-5 h-5" />
                <span>Send Payment Reminders</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                <Users className="w-5 h-5" />
                <span>Customer Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;