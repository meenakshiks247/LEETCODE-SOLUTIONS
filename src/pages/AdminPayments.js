import React, { useState } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Download,
  Mail,
  DollarSign,
  Calendar,
  User,
  Clock,
  X,
  Check
} from 'lucide-react';

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { orders, updatePaymentStatus, getTodayStats } = useOrder();
  const stats = getTodayStats();

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.collegeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      order.paymentStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleBulkPaymentUpdate = (status) => {
    selectedOrders.forEach(orderId => {
      updatePaymentStatus(orderId, status);
    });
    setSelectedOrders([]);
  };

  const sendPaymentReminder = (order) => {
    // In a real implementation, this would send an email/SMS
    alert(`Payment reminder sent to ${order.userName} (${order.email})`);
  };

  const sendBulkReminders = () => {
    const unpaidSelected = filteredOrders.filter(order => 
      selectedOrders.includes(order.id) && order.paymentStatus === 'unpaid'
    );
    
    if (unpaidSelected.length === 0) {
      alert('No unpaid orders selected');
      return;
    }

    alert(`Payment reminders sent to ${unpaidSelected.length} students`);
    setSelectedOrders([]);
  };

  const exportPaymentData = () => {
    const csvData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Student Name': order.userName,
      'College ID': order.collegeId,
      'Email': order.email,
      'Meal Type': order.mealType,
      'Amount': '₹40',
      'Payment Status': order.paymentStatus,
      'Order Date': new Date(order.timestamp).toLocaleDateString(),
      'Time Slot': order.slotDisplay
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
            <p className="text-gray-600">
              Track and manage payment status for all orders
            </p>
          </div>
          <button
            onClick={exportPaymentData}
            className="btn-secondary"
          >
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>

        {/* Payment Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <DollarSign className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹{stats.revenue}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          
          <div className="card text-center">
            <CheckCircle className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.paidOrders}</div>
            <div className="text-sm text-gray-600">Paid Orders</div>
          </div>
          
          <div className="card text-center">
            <AlertCircle className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.unpaidOrders}</div>
            <div className="text-sm text-gray-600">Unpaid Orders</div>
          </div>
          
          <div className="card text-center">
            <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalOrders > 0 ? Math.round((stats.paidOrders / stats.totalOrders) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Payment Rate</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or college ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid Only</option>
                <option value="unpaid">Unpaid Only</option>
              </select>

              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkPaymentUpdate('paid')}
                    className="btn-success"
                  >
                    <Check className="h-4 w-4" />
                    Mark Paid
                  </button>
                  <button
                    onClick={sendBulkReminders}
                    className="btn-warning"
                  >
                    <Mail className="h-4 w-4" />
                    Send Reminders
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.collegeId}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {order.mealType} Meal
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {order.slotDisplay}
                        </div>
                        <div className="text-sm text-gray-500">ID: {order.id}</div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">₹40</div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {order.paymentStatus === 'unpaid' ? (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(order.id, 'paid')}
                              className="text-secondary-600 hover:text-secondary-700"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => sendPaymentReminder(order)}
                              className="text-warning-600 hover:text-warning-700"
                              title="Send Reminder"
                            >
                              <Mail className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'unpaid')}
                            className="text-gray-400 hover:text-gray-600"
                            title="Mark as Unpaid"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p>No orders found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Daily Revenue Breakdown */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Revenue Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-gray-700">Expected Revenue</span>
                <span className="font-bold text-gray-900">₹{stats.totalOrders * 40}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-100 rounded-lg">
                <span className="text-gray-700">Collected Revenue</span>
                <span className="font-bold text-secondary-600">₹{stats.revenue}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <span className="text-gray-700">Pending Revenue</span>
                <span className="font-bold text-warning-600">₹{stats.unpaidOrders * 40}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Insights</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average Payment Time</span>
                <span className="font-medium text-gray-900">~15 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Payment Success Rate</span>
                <span className="font-medium text-gray-900">
                  {stats.totalOrders > 0 ? Math.round((stats.paidOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Reminders Sent Today</span>
                <span className="font-medium text-gray-900">{stats.unpaidOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;