import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  UtensilsCrossed,
  Leaf,
  Drumstick,
  Timer,
  MapPin
} from 'lucide-react';

const Order = () => {
  const [selectedMeal, setSelectedMeal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAuth();
  const { 
    createOrder, 
    getUserOrder, 
    isOrderingOpen, 
    getAvailableSlots, 
    getTodayStats,
    MAX_ORDERS,
    CUTOFF_TIME 
  } = useOrder();
  const navigate = useNavigate();

  const existingOrder = getUserOrder(user.id);
  const stats = getTodayStats();
  const availableSlots = getAvailableSlots();

  useEffect(() => {
    if (existingOrder) {
      navigate('/my-order');
    }
  }, [existingOrder, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!selectedMeal) {
      setError('Please select a meal option');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      userId: user.id,
      userName: user.name,
      email: user.email,
      collegeId: user.collegeId,
      mealType: selectedMeal
    };

    const result = await createOrder(orderData);

    if (result.success) {
      setSuccess('Order placed successfully!');
      setTimeout(() => {
        navigate('/my-order');
      }, 2000);
    } else if (result.waitlisted) {
      setSuccess(result.message);
    } else {
      setError(result.error || 'Failed to place order');
    }

    setIsSubmitting(false);
  };

  const mealOptions = [
    {
      id: 'veg',
      title: 'Vegetarian Meal',
      description: 'Dal, Rice, Roti, Vegetable, Pickle & Sweet',
      icon: Leaf,
      color: 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50',
      iconColor: 'text-secondary-600'
    },
    {
      id: 'non-veg',
      title: 'Non-Vegetarian Meal',
      description: 'Chicken Curry, Rice, Roti, Dal, Pickle & Sweet',
      icon: Drumstick,
      color: 'border-danger-200 hover:border-danger-300 hover:bg-danger-50',
      iconColor: 'text-danger-600'
    }
  ];

  if (!isOrderingOpen()) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <Timer className="h-16 w-16 text-warning-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordering Closed</h2>
            <p className="text-gray-600 mb-4">
              Pre-orders must be placed before {CUTOFF_TIME} AM. 
              Please come back tomorrow between 6:00 AM and {CUTOFF_TIME} AM to place your order.
            </p>
            <div className="text-sm text-gray-500">
              Current orders for today: {stats.totalOrders} / {MAX_ORDERS}
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Order Your Meal</h1>
          <p className="text-gray-600">
            Select your meal preference and confirm your order for today's lunch
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{CUTOFF_TIME} AM</div>
            <div className="text-sm text-gray-600">Order Cutoff</div>
          </div>
          <div className="card text-center">
            <Users className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.spotsLeft}</div>
            <div className="text-sm text-gray-600">Spots Remaining</div>
          </div>
          <div className="card text-center">
            <MapPin className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">₹40</div>
            <div className="text-sm text-gray-600">Price per Meal</div>
          </div>
        </div>

        {/* Alert if low spots */}
        {stats.spotsLeft <= 20 && stats.spotsLeft > 0 && (
          <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-warning-600 mr-2" />
              <span className="text-warning-800 font-medium">
                Only {stats.spotsLeft} spots left! Order now to secure your meal.
              </span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Your Meal</h2>

            {error && (
              <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
                  <span className="text-danger-800">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mr-2" />
                  <span className="text-secondary-800">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meal Options */}
              <div className="space-y-4">
                {mealOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        selectedMeal === option.id
                          ? `${option.color} border-opacity-100`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="meal"
                        value={option.id}
                        checked={selectedMeal === option.id}
                        onChange={(e) => setSelectedMeal(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`h-8 w-8 mr-4 ${option.iconColor}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">₹40</div>
                    </label>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedMeal || stats.spotsLeft === 0}
                className="w-full btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Placing Order...
                  </>
                ) : stats.spotsLeft === 0 ? (
                  'No Spots Available'
                ) : (
                  <>
                    <UtensilsCrossed className="h-5 w-5" />
                    Confirm Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Available Slots */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Time Slots</h2>
            <div className="space-y-3">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    slot.available
                      ? 'border-secondary-200 bg-secondary-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className={`h-5 w-5 ${slot.available ? 'text-secondary-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${slot.available ? 'text-gray-900' : 'text-gray-500'}`}>
                      {slot.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${slot.available ? 'text-secondary-600' : 'text-gray-500'}`}>
                      {25 - slot.count}/25 available
                    </span>
                    {slot.available ? (
                      <span className="badge-success">Open</span>
                    ) : (
                      <span className="badge-danger">Full</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">📋 How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Select your meal and confirm order</li>
                <li>• Get assigned to next available slot</li>
                <li>• Receive QR code for pickup</li>
                <li>• Pay ₹40 online before pickup</li>
                <li>• Show QR during your time slot</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;