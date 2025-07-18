import React, { useState, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CreditCard,
  UtensilsCrossed,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  DollarSign,
  UserCheck,
  Timer
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AdminDashboard = () => {
  const { orders, waitlist, getTodayStats } = useOrder();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  const stats = getTodayStats();

  // Generate hourly booking data for today
  const getHourlyBookings = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const today = new Date().toDateString();
    
    const todayOrders = orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    );

    return hours.map(hour => {
      const hourOrders = todayOrders.filter(order => {
        const orderHour = new Date(order.timestamp).getHours();
        return orderHour === hour;
      });
      return hourOrders.length;
    });
  };

  // Generate weekly data (last 7 days)
  const getWeeklyData = () => {
    const days = [];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayString = date.toDateString();
      
      const dayOrders = orders.filter(order => 
        new Date(order.timestamp).toDateString() === dayString
      );
      
      days.push(dayOrders.length);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    
    return { days, labels };
  };

  const hourlyData = getHourlyBookings();
  const weeklyData = getWeeklyData();

  // Chart configurations
  const hourlyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Orders per Hour',
        data: hourlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: 'Daily Orders',
        data: weeklyData.days,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const mealTypeData = {
    labels: ['Vegetarian', 'Non-Vegetarian'],
    datasets: [
      {
        data: [
          orders.filter(o => o.mealType === 'veg').length,
          orders.filter(o => o.mealType === 'non-veg').length,
        ],
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

  // Top customers
  const getTopCustomers = () => {
    const customerOrders = {};
    orders.forEach(order => {
      if (customerOrders[order.userName]) {
        customerOrders[order.userName]++;
      } else {
        customerOrders[order.userName] = 1;
      }
    });
    
    return Object.entries(customerOrders)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const topCustomers = getTopCustomers();

  // Peak hours analysis
  const getPeakHours = () => {
    const peakData = hourlyData.map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    return peakData;
  };

  const peakHours = getPeakHours();

  return (
    <div className="container-custom py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Real-time analytics and insights for Smart Canteen System
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
          <div className="card text-center">
            <UtensilsCrossed className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          
          <div className="card text-center">
            <CheckCircle className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.servedOrders}</div>
            <div className="text-sm text-gray-600">Served</div>
          </div>
          
          <div className="card text-center">
            <Timer className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders - stats.servedOrders}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="card text-center">
            <DollarSign className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹{stats.revenue}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          
          <div className="card text-center">
            <Users className="h-8 w-8 text-danger-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.waitlistCount}</div>
            <div className="text-sm text-gray-600">Waitlisted</div>
          </div>
          
          <div className="card text-center">
            <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.spotsLeft}</div>
            <div className="text-sm text-gray-600">Spots Left</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Orders Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders by Hour (Today)</h2>
            <Bar data={hourlyChartData} options={chartOptions} />
          </div>

          {/* Weekly Trend Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Trend</h2>
            <Line data={weeklyChartData} options={chartOptions} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Meal Type Distribution */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meal Type Distribution</h2>
            <div className="flex justify-center">
              <div className="w-64 h-64">
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
            </div>
          </div>

          {/* Top Customers */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequent Customers</h2>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{customer.count} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Peak Hours Today</h2>
            <div className="space-y-3">
              {peakHours.map((peak, index) => (
                <div key={peak.hour} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">
                      {peak.hour}:00 - {peak.hour + 1}:00
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{peak.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Payment Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary-600" />
                  <span className="font-medium text-gray-900">Paid Orders</span>
                </div>
                <span className="text-lg font-bold text-secondary-600">{stats.paidOrders}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-warning-600" />
                  <span className="font-medium text-gray-900">Unpaid Orders</span>
                </div>
                <span className="text-lg font-bold text-warning-600">{stats.unpaidOrders}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Rate</span>
                  <span className="font-bold text-gray-900">
                    {stats.totalOrders > 0 ? Math.round((stats.paidOrders / stats.totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Insights */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Operational Insights</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Average Orders/Hour</div>
                  <div className="text-sm text-gray-600">During peak hours</div>
                </div>
                <span className="text-lg font-bold text-primary-600">
                  {Math.round(stats.totalOrders / 8)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Capacity Utilization</div>
                  <div className="text-sm text-gray-600">Today's bookings</div>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {Math.round((stats.totalOrders / 200) * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Service Rate</div>
                  <div className="text-sm text-gray-600">Orders served on time</div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {stats.totalOrders > 0 ? Math.round((stats.servedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Meal Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Time Slot</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(-10).reverse().map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.collegeId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">{order.mealType}</td>
                    <td className="py-3 px-4">{order.slotDisplay}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        order.served ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.served ? 'Served' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;