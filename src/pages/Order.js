import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Utensils, 
  Leaf, 
  Meat,
  ShoppingCart,
  Calendar,
  CreditCard,
  Info,
  Timer,
  ArrowRight
} from 'lucide-react';

const Order = () => {
  const { user } = useAuth();
  const { 
    createOrder, 
    myOrder, 
    isOrderingOpen, 
    availableSlots, 
    orderStats, 
    loading 
  } = useOrders();
  
  const [selectedMealType, setSelectedMealType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Check if user already has an order
  useEffect(() => {
    if (myOrder) {
      navigate('/my-order');
    }
  }, [myOrder, navigate]);

  const handleOrderSubmit = async () => {
    if (!selectedMealType) {
      setError('Please select a meal type');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await createOrder({ mealType: selectedMealType });
      
      if (result.success) {
        setSuccess('Order placed successfully!');
        setTimeout(() => {
          navigate('/my-order');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealOptions = [
    {
      id: 'veg',
      name: 'Vegetarian Meal',
      icon: Leaf,
      description: 'Fresh vegetarian meal with seasonal vegetables, dal, rice, roti, and salad',
      color: 'text-green-600 bg-green-100',
      borderColor: 'border-green-200 hover:border-green-300',
      selectedColor: 'border-green-500 bg-green-50'
    },
    {
      id: 'nonveg',
      name: 'Non-Vegetarian Meal',
      icon: Meat,
      description: 'Protein-rich non-veg meal with chicken/mutton curry, dal, rice, roti, and salad',
      color: 'text-red-600 bg-red-100',
      borderColor: 'border-red-200 hover:border-red-300',
      selectedColor: 'border-red-500 bg-red-50'
    }
  ];

  const currentTime = new Date();
  const nextSlot = availableSlots.find(slot => slot.available);

  if (!isOrderingOpen()) {
    return (
      <div className="container-mobile max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ordering is Closed</h1>
          <p className="text-gray-600 mb-6">
            Sorry! Meal ordering is only available until 10:00 AM daily.
            Please come back tomorrow between 6:00 AM and 10:00 AM to place your order.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Ordering Schedule:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Orders open: 6:00 AM daily</div>
              <div>• Orders close: 10:00 AM daily</div>
              <div>• Meal pickup: 12:00 PM - 2:00 PM</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-gradient text-white px-6 py-3 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-mobile max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Order Your Meal
          </h1>
          <p className="text-lg text-gray-600">
            Select your preferred meal and secure your spot for today's lunch
          </p>
        </div>

        {/* Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-green-900">Ordering Open</div>
            <div className="text-sm text-green-700">Until 10:00 AM</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-blue-900">{200 - orderStats.total} Left</div>
            <div className="text-sm text-blue-700">Available slots</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-purple-900">
              {nextSlot ? nextSlot.time : 'No slots'}
            </div>
            <div className="text-sm text-purple-700">Next available slot</div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Student Name:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div>
                <span className="text-gray-500">College ID:</span>
                <span className="ml-2 font-medium">{user.collegeId}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Order Date:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Meal Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Meal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealOptions.map((meal) => {
                const Icon = meal.icon;
                const isSelected = selectedMealType === meal.id;
                
                return (
                  <button
                    key={meal.id}
                    onClick={() => {
                      setSelectedMealType(meal.id);
                      setError('');
                    }}
                    className={`relative border-2 rounded-xl p-6 text-left transition-all duration-200 ${
                      isSelected 
                        ? meal.selectedColor 
                        : `border-gray-200 hover:border-gray-300 ${meal.borderColor}`
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${meal.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{meal.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{meal.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">₹40</span>
                      <span className="text-sm text-gray-500">Per meal</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Information */}
          {nextSlot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <Timer className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Your Pickup Slot</h3>
              </div>
              <div className="text-blue-800">
                <p className="mb-2">
                  Your meal will be ready for pickup at: <strong>{nextSlot.time}</strong>
                </p>
                <p className="text-sm">
                  Please arrive during your designated time slot with your QR code for quick service.
                </p>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-900">Payment Information</h3>
            </div>
            <div className="text-yellow-800 text-sm space-y-1">
              <p>• Payment of ₹40 will be processed after order confirmation</p>
              <p>• Multiple payment options available: UPI, Cards, Net Banking</p>
              <p>• You can also pay at the canteen during pickup</p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Info className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Important Notes</h3>
            </div>
            <div className="text-gray-700 text-sm space-y-1">
              <p>• Orders must be placed before 10:00 AM daily</p>
              <p>• Maximum 200 orders per day (first come, first served)</p>
              <p>• Pickup is available from 12:00 PM to 2:00 PM</p>
              <p>• Please bring your QR code for order verification</p>
              <p>• Cancellations are not allowed after order confirmation</p>
            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrderSubmit}
            disabled={!selectedMealType || isSubmitting || loading}
            className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="spinner w-5 h-5"></div>
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Place Order</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!selectedMealType && (
            <p className="text-center text-gray-500 text-sm mt-3">
              Please select a meal type to continue
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <Utensils className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{orderStats.total}</div>
            <div className="text-sm text-gray-600">Orders Today</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{orderStats.veg}</div>
            <div className="text-sm text-gray-600">Veg Orders</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow">
            <Meat className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{orderStats.nonVeg}</div>
            <div className="text-sm text-gray-600">Non-Veg Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;