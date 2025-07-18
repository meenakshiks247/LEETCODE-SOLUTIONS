import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import QRCode from 'qrcode.react';
import { 
  QrCode, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Download, 
  Share2,
  AlertCircle,
  Calendar,
  User,
  Utensils,
  MapPin,
  Copy,
  Check,
  Phone,
  Mail,
  Loader,
  ExternalLink
} from 'lucide-react';

const MyOrder = () => {
  const { user } = useAuth();
  const { myOrder, updatePaymentStatus } = useOrders();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!myOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-mobile max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
            <p className="text-gray-600 mb-6">
              You haven't placed any order for today. Would you like to order now?
            </p>
            <Link
              to="/order"
              className="btn-gradient text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
            >
              <Utensils className="w-5 h-5" />
              <span>Place Order</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'served':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const handlePayment = async (method) => {
    setPaymentLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updatePaymentStatus(myOrder.id, 'paid');
    setPaymentLoading(false);
    setShowPaymentModal(false);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = `canteen-order-${myOrder.id}.png`;
      link.href = url;
      link.click();
    }
  };

  const shareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Canteen Order',
          text: `Order ${myOrder.id} - ${myOrder.mealType} meal at ${myOrder.slot}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(myOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const orderDetails = [
    { label: 'Order ID', value: myOrder.id, copyable: true },
    { label: 'Student Name', value: myOrder.userName },
    { label: 'College ID', value: myOrder.collegeId },
    { label: 'Meal Type', value: myOrder.mealType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian' },
    { label: 'Pickup Time', value: myOrder.slot },
    { label: 'Amount', value: `₹${myOrder.amount}` },
    { label: 'Order Date', value: new Date(myOrder.createdAt).toLocaleDateString() },
    { label: 'Order Time', value: new Date(myOrder.createdAt).toLocaleTimeString() }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-mobile max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Order
          </h1>
          <p className="text-lg text-gray-600">
            Your order details and QR code for pickup
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Order Status</h3>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(myOrder.orderStatus)}`}>
              {myOrder.orderStatus === 'confirmed' && 'Confirmed'}
              {myOrder.orderStatus === 'served' && 'Served'}
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              {myOrder.orderStatus === 'confirmed' && 'Your order is confirmed and being prepared'}
              {myOrder.orderStatus === 'served' && `Served at ${new Date(myOrder.servedAt).toLocaleTimeString()}`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Payment Status</h3>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(myOrder.paymentStatus)}`}>
              {myOrder.paymentStatus === 'paid' && 'Paid'}
              {myOrder.paymentStatus === 'pending' && 'Pending'}
            </div>
            {myOrder.paymentStatus === 'pending' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Pay Now →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your QR Code</h2>
              
              <div className="qr-container rounded-xl p-8 mb-6 print-area">
                <QRCode
                  id="qr-code-canvas"
                  value={myOrder.qrCode}
                  size={200}
                  level="H"
                  includeMargin
                  className="mx-auto"
                />
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-900">Order #{myOrder.id}</p>
                  <p className="text-sm text-gray-600">{myOrder.userName}</p>
                  <p className="text-sm text-gray-600">Pickup: {myOrder.slot}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadQR}
                  className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR</span>
                </button>
                
                <button
                  onClick={shareOrder}
                  className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>🖨️ Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            <div className="space-y-4">
              {orderDetails.map((detail, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">{detail.label}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{detail.value}</span>
                    {detail.copyable && (
                      <button
                        onClick={copyOrderId}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Pickup Instructions</h3>
          </div>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>• Arrive at the canteen during your designated time slot: <strong>{myOrder.slot}</strong></p>
            <p>• Show this QR code to the canteen staff for verification</p>
            <p>• Have your college ID ready for additional verification if needed</p>
            <p>• If payment is pending, you can pay at the counter or use the "Pay Now" option above</p>
            <p>• For any issues, contact the canteen administration</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Canteen Phone</p>
                <p className="text-gray-600">+91 12345 67890</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Support Email</p>
                <p className="text-gray-600">canteen@college.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Payment</h3>
              <p className="text-gray-600 mb-6">Amount to pay: <span className="font-bold text-2xl text-primary-600">₹{myOrder.amount}</span></p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handlePayment('upi')}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {paymentLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>💳</span>
                      <span>Pay with UPI</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handlePayment('card')}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {paymentLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with Card</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handlePayment('wallet')}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {paymentLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>👛</span>
                      <span>Pay with Wallet</span>
                    </>
                  )}
                </button>
              </div>
              
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
                className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

export default MyOrder;