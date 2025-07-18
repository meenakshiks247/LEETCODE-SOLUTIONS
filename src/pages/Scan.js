import React, { useState, useRef, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { 
  Camera, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  User,
  UtensilsCrossed,
  X,
  Scan as ScanIcon
} from 'lucide-react';

const Scan = () => {
  const [scannedData, setScannedData] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const { orders, markOrderServed } = useOrder();

  const handleManualInput = (e) => {
    setScannedData(e.target.value);
    setError('');
    setScanResult(null);
  };

  const processQRCode = (qrData) => {
    // Find order by QR code
    const order = orders.find(o => o.qrCode === qrData);
    
    if (!order) {
      setScanResult({
        type: 'error',
        message: 'Invalid QR code. Order not found.',
        order: null
      });
      return;
    }

    if (order.served) {
      setScanResult({
        type: 'warning',
        message: 'This order has already been served.',
        order: order
      });
      return;
    }

    if (order.paymentStatus !== 'paid') {
      setScanResult({
        type: 'error',
        message: 'Payment not completed. Please ask student to complete payment first.',
        order: order
      });
      return;
    }

    // Check if current time is within the slot
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
    
    const [slotHour, slotMinute] = order.slot.split(':').map(Number);
    const slotStartTime = slotHour * 60 + slotMinute;
    const slotEndTime = slotStartTime + 15; // 15 minute slots
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    if (currentTimeMinutes < slotStartTime || currentTimeMinutes > slotEndTime) {
      setScanResult({
        type: 'warning',
        message: `This order is for ${order.slotDisplay}. Current time slot doesn't match.`,
        order: order
      });
      return;
    }

    setScanResult({
      type: 'success',
      message: 'Valid QR code! Ready to serve meal.',
      order: order
    });
  };

  const handleScan = () => {
    setError('');
    setScanResult(null);

    if (!scannedData.trim()) {
      setError('Please enter a QR code');
      return;
    }

    processQRCode(scannedData.trim());
  };

  const handleServeOrder = () => {
    if (scanResult && scanResult.order) {
      markOrderServed(scanResult.order.id);
      setScanResult({
        ...scanResult,
        type: 'success',
        message: 'Order marked as served successfully!',
        order: { ...scanResult.order, served: true }
      });
      setScannedData('');
    }
  };

  const startCameraScanning = () => {
    setIsScanning(true);
    // In a real implementation, you would integrate with a camera library
    // For demo purposes, we'll simulate camera scanning
    setTimeout(() => {
      // Simulate scanning a QR code
      const sampleOrder = orders.find(o => !o.served && o.paymentStatus === 'paid');
      if (sampleOrder) {
        setScannedData(sampleOrder.qrCode);
        processQRCode(sampleOrder.qrCode);
      }
      setIsScanning(false);
    }, 2000);
  };

  const getTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    );
  };

  const todayOrders = getTodayOrders();
  const servedOrders = todayOrders.filter(o => o.served);
  const pendingOrders = todayOrders.filter(o => !o.served && o.paymentStatus === 'paid');

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
          <p className="text-gray-600">
            Scan student QR codes to verify and serve meals
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <UtensilsCrossed className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{servedOrders.length}</div>
            <div className="text-sm text-gray-600">Served Today</div>
          </div>
          <div className="card text-center">
            <Clock className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{pendingOrders.length}</div>
            <div className="text-sm text-gray-600">Pending Pickup</div>
          </div>
          <div className="card text-center">
            <QrCode className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{todayOrders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Scan QR Code</h2>

            {/* Camera Scanner Button */}
            <div className="mb-6">
              <button
                onClick={startCameraScanning}
                disabled={isScanning}
                className="w-full btn-primary"
              >
                {isScanning ? (
                  <>
                    <div className="spinner" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    Start Camera Scanner
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-gray-500 mb-6">OR</div>

            {/* Manual Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code Manually
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={scannedData}
                  onChange={handleManualInput}
                  placeholder="Paste or type QR code here..."
                  className="input-field"
                />
              </div>

              <button
                onClick={handleScan}
                disabled={!scannedData.trim()}
                className="w-full btn-secondary"
              >
                <ScanIcon className="h-5 w-5" />
                Verify QR Code
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
                  <span className="text-danger-800">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Scan Result */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Scan Result</h2>

            {scanResult ? (
              <div className="space-y-4">
                {/* Status Message */}
                <div className={`p-4 rounded-lg border ${
                  scanResult.type === 'success' 
                    ? 'bg-secondary-50 border-secondary-200' 
                    : scanResult.type === 'warning'
                    ? 'bg-warning-50 border-warning-200'
                    : 'bg-danger-50 border-danger-200'
                }`}>
                  <div className="flex items-center">
                    {scanResult.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-secondary-600 mr-2" />
                    ) : (
                      <AlertCircle className={`h-5 w-5 mr-2 ${
                        scanResult.type === 'warning' ? 'text-warning-600' : 'text-danger-600'
                      }`} />
                    )}
                    <span className={`font-medium ${
                      scanResult.type === 'success' 
                        ? 'text-secondary-800' 
                        : scanResult.type === 'warning'
                        ? 'text-warning-800'
                        : 'text-danger-800'
                    }`}>
                      {scanResult.message}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                {scanResult.order && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student:</span>
                        <span className="font-medium">{scanResult.order.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">College ID:</span>
                        <span className="font-medium">{scanResult.order.collegeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meal Type:</span>
                        <span className="font-medium capitalize">{scanResult.order.mealType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Slot:</span>
                        <span className="font-medium">{scanResult.order.slotDisplay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className={`badge ${
                          scanResult.order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {scanResult.order.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`badge ${
                          scanResult.order.served ? 'badge-success' : 'badge-warning'
                        }`}>
                          {scanResult.order.served ? 'Served' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Serve Button */}
                    {scanResult.type === 'success' && !scanResult.order.served && (
                      <button
                        onClick={handleServeOrder}
                        className="w-full mt-4 btn-success"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Served
                      </button>
                    )}
                  </div>
                )}

                {/* Clear Button */}
                <button
                  onClick={() => {
                    setScanResult(null);
                    setScannedData('');
                    setError('');
                  }}
                  className="w-full btn-secondary"
                >
                  <X className="h-5 w-5" />
                  Clear Result
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p>Scan or enter a QR code to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Test</h2>
          <p className="text-gray-600 mb-4">
            Use these sample QR codes to test the scanner:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {pendingOrders.slice(0, 4).map((order) => (
              <button
                key={order.id}
                onClick={() => {
                  setScannedData(order.qrCode);
                  processQRCode(order.qrCode);
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{order.userName}</div>
                    <div className="text-sm text-gray-600">{order.slotDisplay}</div>
                  </div>
                  <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    Test QR
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;