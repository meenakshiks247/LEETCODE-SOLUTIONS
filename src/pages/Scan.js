import React, { useState, useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  User,
  Clock,
  Utensils,
  Search,
  X,
  Check,
  Ban,
  CreditCard,
  MapPin
} from 'lucide-react';

const Scan = () => {
  const { orders, markOrderAsServed } = useOrders();
  const [scanInput, setScanInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Today's orders for manual search
  const todayOrders = orders.filter(order => 
    order.createdAt.startsWith(new Date().toISOString().split('T')[0])
  );

  const filteredOrders = todayOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.collegeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScan = () => {
    if (!scanInput.trim()) {
      setScanResult({ type: 'error', message: 'Please enter QR code data' });
      return;
    }

    try {
      // Try to parse QR code data
      const qrData = JSON.parse(scanInput);
      const order = orders.find(o => o.id === qrData.orderId);

      if (!order) {
        setScanResult({ type: 'error', message: 'Order not found' });
        setScannedOrder(null);
        return;
      }

      // Check if order is for today
      const today = new Date().toISOString().split('T')[0];
      if (!order.createdAt.startsWith(today)) {
        setScanResult({ type: 'error', message: 'This order is not for today' });
        setScannedOrder(null);
        return;
      }

      // Check if already served
      if (order.orderStatus === 'served') {
        setScanResult({ type: 'warning', message: 'This order has already been served' });
        setScannedOrder(order);
        return;
      }

      // Check time slot
      const currentTime = new Date();
      const [slotHour, slotMinute] = order.slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(slotHour, slotMinute, 0, 0);
      
      const timeDiff = currentTime - slotTime;
      const isInTimeWindow = timeDiff >= -15 * 60 * 1000 && timeDiff <= 15 * 60 * 1000; // 15 min window

      if (!isInTimeWindow && currentTime < slotTime) {
        setScanResult({ type: 'warning', message: 'Order time slot has not started yet' });
        setScannedOrder(order);
        return;
      }

      setScanResult({ type: 'success', message: 'Valid order - Ready to serve' });
      setScannedOrder(order);

    } catch (error) {
      // Try to find by order ID directly
      const order = orders.find(o => o.id === scanInput.trim());
      if (order) {
        setScanResult({ type: 'success', message: 'Order found by ID' });
        setScannedOrder(order);
      } else {
        setScanResult({ type: 'error', message: 'Invalid QR code format' });
        setScannedOrder(null);
      }
    }
  };

  const handleServeOrder = () => {
    if (scannedOrder && scannedOrder.orderStatus !== 'served') {
      markOrderAsServed(scannedOrder.id);
      setScanResult({ type: 'success', message: 'Order marked as served successfully!' });
      setScannedOrder(prev => ({ ...prev, orderStatus: 'served', servedAt: new Date().toISOString() }));
    }
  };

  const handleManualSelect = (order) => {
    setScannedOrder(order);
    if (order.orderStatus === 'served') {
      setScanResult({ type: 'warning', message: 'This order has already been served' });
    } else {
      setScanResult({ type: 'success', message: 'Order selected - Ready to serve' });
    }
  };

  const clearScan = () => {
    setScanInput('');
    setScannedOrder(null);
    setScanResult(null);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'served':
        return 'text-green-700 bg-green-100';
      case 'confirmed':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Stats for today
  const stats = {
    total: todayOrders.length,
    served: todayOrders.filter(o => o.orderStatus === 'served').length,
    pending: todayOrders.filter(o => o.orderStatus === 'confirmed').length,
    paid: todayOrders.filter(o => o.paymentStatus === 'paid').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Order Scanner
          </h1>
          <p className="text-lg text-gray-600">
            Scan QR codes to verify and serve orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <Utensils className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.served}</div>
            <div className="text-sm text-gray-600">Served</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.paid}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <QrCode className="w-6 h-6 mr-2" />
              QR Code Scanner
            </h2>

            {/* Camera Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCamera(!showCamera)}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>{showCamera ? 'Hide Camera' : 'Open Camera'}</span>
              </button>
              
              {showCamera && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    Camera functionality would be implemented here using libraries like react-qr-scanner
                  </p>
                </div>
              )}
            </div>

            {/* Manual Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manual QR Code Input
                </label>
                <textarea
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Paste QR code data or enter Order ID..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleScan}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Scan/Verify</span>
                </button>
                
                <button
                  onClick={clearScan}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                scanResult.type === 'success' ? 'bg-green-50 border border-green-200' :
                scanResult.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {scanResult.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {scanResult.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  {scanResult.type === 'error' && <Ban className="w-5 h-5 text-red-600" />}
                  <span className={`font-medium ${
                    scanResult.type === 'success' ? 'text-green-800' :
                    scanResult.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {scanResult.message}
                  </span>
                </div>
              </div>
            )}

            {/* Order Details */}
            {scannedOrder && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{scannedOrder.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-medium">{scannedOrder.userName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">College ID:</span>
                    <span className="font-medium">{scannedOrder.collegeId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meal Type:</span>
                    <span className="font-medium capitalize">{scannedOrder.mealType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Slot:</span>
                    <span className="font-medium">{scannedOrder.slot}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{scannedOrder.amount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(scannedOrder.paymentStatus)}`}>
                      {scannedOrder.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(scannedOrder.orderStatus)}`}>
                      {scannedOrder.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Serve Button */}
                {scannedOrder.orderStatus !== 'served' && (
                  <button
                    onClick={handleServeOrder}
                    className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Mark as Served</span>
                  </button>
                )}

                {scannedOrder.orderStatus === 'served' && (
                  <div className="mt-6 p-3 bg-green-100 rounded-lg text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <span className="text-green-800 font-medium">Order Already Served</span>
                    {scannedOrder.servedAt && (
                      <div className="text-sm text-green-700 mt-1">
                        Served at: {new Date(scannedOrder.servedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Orders</h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Name, or College ID..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Orders */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleManualSelect(order)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      scannedOrder?.id === order.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-600">{order.collegeId}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-gray-500">{order.id}</div>
                        <div className="text-sm text-gray-600">{order.slot}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {order.mealType}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;