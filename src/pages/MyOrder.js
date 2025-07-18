import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import QRCode from 'react-qr-code';
import { 
  Clock, 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  AlertCircle,
  Download,
  Share2,
  MapPin,
  UtensilsCrossed,
  User,
  Leaf,
  Drumstick,
  X
} from 'lucide-react';

const MyOrder = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { user } = useAuth();
  const { getUserOrder, updatePaymentStatus, cancelOrder } = useOrder();

  const order = getUserOrder(user.id);

  const handlePayment = async (method) => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updatePaymentStatus(order.id, 'paid');
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel your order?')) {
      cancelOrder(order.id);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `canteen-qr-${order.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Canteen Order QR Code',
          text: `Order ID: ${order.id} | Slot: ${order.slotDisplay}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Order ID: ${order.qrCode} | Slot: ${order.slotDisplay}`);
      alert('Order details copied to clipboard!');
    }
  };

  if (!order) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Order Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any order for today. Would you like to order now?
            </p>
            <Link to="/order" className="btn-primary">
              <UtensilsCrossed className="h-5 w-5" />
              Place Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Order</h1>
          <p className="text-gray-600">
            Your meal is confirmed for today's lunch service
          </p>
        </div>

        {/* Order Status */}
        <div className="mb-8">
          {order.paymentStatus === 'paid' ? (
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-secondary-600 mr-3" />
                <div>
                  <div className="font-medium text-secondary-800">Order Confirmed & Paid</div>
                  <div className="text-sm text-secondary-600">
                    Show your QR code during your time slot to collect your meal
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-warning-600 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-warning-800">Payment Pending</div>
                  <div className="text-sm text-warning-600">
                    Please complete payment to confirm your order
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="btn-warning"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-medium">{order.collegeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time Slot</span>
                  <span className="font-medium text-primary-600">{order.slotDisplay}</span>
                </div>
              </div>
            </div>

            {/* Meal Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Meal Details</h2>
              <div className="flex items-center space-x-4">
                {order.mealType === 'veg' ? (
                  <Leaf className="h-8 w-8 text-secondary-600" />
                ) : (
                  <Drumstick className="h-8 w-8 text-danger-600" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {order.mealType === 'veg' ? 'Vegetarian Meal' : 'Non-Vegetarian Meal'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.mealType === 'veg' 
                      ? 'Dal, Rice, Roti, Vegetable, Pickle & Sweet'
                      : 'Chicken Curry, Rice, Roti, Dal, Pickle & Sweet'
                    }
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">₹40</div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Status</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">₹40.00</div>
                    <div className="text-sm text-gray-600">Meal Cost</div>
                  </div>
                </div>
                <div>
                  {order.paymentStatus === 'paid' ? (
                    <span className="badge-success">Paid</span>
                  ) : (
                    <span className="badge-warning">Pending</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              {order.paymentStatus === 'unpaid' && (
                <>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 btn-primary"
                  >
                    <CreditCard className="h-5 w-5" />
                    Complete Payment
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="btn-danger"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your QR Code</h2>
            
            <div className="text-center">
              <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-lg mb-4">
                <QRCode
                  id="qr-code"
                  value={order.qrCode}
                  size={200}
                  level="H"
                />
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                Show this QR code at the canteen during your time slot
              </div>

              <div className="flex space-x-2 justify-center">
                <button
                  onClick={downloadQR}
                  className="btn-secondary"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={shareQR}
                  className="btn-secondary"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">📋 Pickup Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Arrive during your time slot: <strong>{order.slotDisplay}</strong></li>
                <li>• Show this QR code to the canteen staff</li>
                <li>• Payment must be completed before pickup</li>
                <li>• Bring your student ID card</li>
                <li>• Follow canteen guidelines and queue properly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">₹40.00</div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handlePayment('upi')}
                  disabled={isProcessingPayment}
                  className="w-full btn-primary"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="spinner" />
                      Processing...
                    </>
                  ) : (
                    'Pay with UPI'
                  )}
                </button>
                
                <button
                  onClick={() => handlePayment('card')}
                  disabled={isProcessingPayment}
                  className="w-full btn-secondary"
                >
                  Pay with Card
                </button>
                
                <button
                  onClick={() => handlePayment('wallet')}
                  disabled={isProcessingPayment}
                  className="w-full btn-secondary"
                >
                  Pay with Wallet
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                This is a demo. Payment will be marked as completed automatically.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;