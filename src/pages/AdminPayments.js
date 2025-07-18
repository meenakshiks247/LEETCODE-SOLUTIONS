import React, { useState, useMemo } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Filter,
  Mail,
  Phone,
  Download,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Send,
  Eye,
  Edit,
  X,
  Check
} from 'lucide-react';

const AdminPayments = () => {
  const { orders, updatePaymentStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.collegeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        filterStatus === 'all' || 
        order.paymentStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => order.createdAt.startsWith(today));
    
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').length * 40;
    const pendingRevenue = orders.filter(o => o.paymentStatus === 'pending').length * 40;
    const todayRevenue = todayOrders.filter(o => o.paymentStatus === 'paid').length * 40;
    const todayPending = todayOrders.filter(o => o.paymentStatus === 'pending').length * 40;

    return {
      totalOrders: orders.length,
      paidOrders: orders.filter(o => o.paymentStatus === 'paid').length,
      pendingOrders: orders.filter(o => o.paymentStatus === 'pending').length,
      totalRevenue,
      pendingRevenue,
      todayRevenue,
      todayPending,
      paymentRate: orders.length > 0 ? Math.round((orders.filter(o => o.paymentStatus === 'paid').length / orders.length) * 100) : 0
    };
  }, [orders]);

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    }
  };

  const handleMarkAsPaid = (orderId) => {
    updatePaymentStatus(orderId, 'paid');
  };

  const handleBulkMarkAsPaid = () => {
    selectedOrders.forEach(orderId => {
      updatePaymentStatus(orderId, 'paid');
    });
    setSelectedOrders([]);
  };

  const sendReminder = (order) => {
    // Simulate sending reminder
    alert(`Payment reminder sent to ${order.userName} (${order.userEmail})`);
    setSelectedOrder(null);
    setShowReminderModal(false);
  };

  const sendBulkReminders = () => {
    const pendingOrders = selectedOrders.map(id => 
      orders.find(order => order.id === id)
    ).filter(order => order && order.paymentStatus === 'pending');

    alert(`Payment reminders sent to ${pendingOrders.length} students`);
    setSelectedOrders([]);
  };

  const exportData = () => {
    const csvContent = [
      ['Order ID', 'Student Name', 'College ID', 'Email', 'Meal Type', 'Amount', 'Payment Status', 'Order Date'],
      ...filteredOrders.map(order => [
        order.id,
        order.userName,
        order.collegeId,
        order.userEmail,
        order.mealType,
        order.amount,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Paid</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      subtitle: `From ${stats.paidOrders} orders`
    },
    {
      title: 'Pending Revenue',
      value: `₹${stats.pendingRevenue}`,
      icon: AlertCircle,
      color: 'text-yellow-600 bg-yellow-100',
      subtitle: `From ${stats.pendingOrders} orders`
    },
    {
      title: 'Payment Rate',
      value: `${stats.paymentRate}%`,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100',
      subtitle: `${stats.paidOrders}/${stats.totalOrders} paid`
    },
    {
      title: 'Today\'s Revenue',
      value: `₹${stats.todayRevenue}`,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
      subtitle: `₹${stats.todayPending} pending`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Management
          </h1>
          <p className="text-lg text-gray-600">
            Track payments, send reminders, and manage financial records
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
                <div className="text-sm text-gray-600">
                  {card.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or email..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {selectedOrders.length > 0 && (
                <>
                  <button
                    onClick={handleBulkMarkAsPaid}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as Paid ({selectedOrders.length})</span>
                  </button>
                  
                  <button
                    onClick={sendBulkReminders}
                    className="flex items-center justify-center space-x-2 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reminders</span>
                  </button>
                </>
              )}
              
              <button
                onClick={exportData}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Payment Records</h2>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.collegeId}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="text-sm text-gray-500 capitalize">{order.mealType} meal</div>
                        <div className="text-sm text-gray-500">Slot: {order.slot}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{order.amount}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {order.paymentStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleMarkAsPaid(order.id)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="Mark as Paid"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowReminderModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-700 transition-colors"
                              title="Send Reminder"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reminder Modal */}
        {showReminderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Send Payment Reminder</h3>
                <button
                  onClick={() => setShowReminderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Student: {selectedOrder.userName}</div>
                    <div>College ID: {selectedOrder.collegeId}</div>
                    <div>Email: {selectedOrder.userEmail}</div>
                    <div>Order: #{selectedOrder.id}</div>
                    <div>Amount: ₹{selectedOrder.amount}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => sendReminder(selectedOrder)}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Email Reminder</span>
                  </button>
                  
                  <button
                    onClick={() => sendReminder(selectedOrder)}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Send SMS Reminder</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowReminderModal(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;