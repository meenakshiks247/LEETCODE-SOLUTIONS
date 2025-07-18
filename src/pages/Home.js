import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { 
  ShoppingCart, 
  Clock, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Utensils,
  Calendar,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { orderStats, isOrderingOpen, myOrder } = useOrders();

  const features = [
    {
      icon: Calendar,
      title: 'Pre-Order System',
      description: 'Order your meals before 10 AM and skip the queue',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Clock,
      title: 'Time Slot Management',
      description: 'Get assigned specific pickup times to avoid crowding',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: QrCode,
      title: 'QR Code Verification',
      description: 'Quick and contactless order verification system',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: CreditCard,
      title: 'Digital Payments',
      description: 'Secure online payments with multiple payment options',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track demand patterns and optimize food preparation',
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Responsive design that works perfectly on all devices',
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  const stats = [
    { label: 'Daily Orders', value: orderStats.total, icon: Utensils },
    { label: 'Available Slots', value: 200 - orderStats.total, icon: Clock },
    { label: 'Happy Customers', value: '500+', icon: Users },
    { label: 'Success Rate', value: '99%', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Smart Canteen
              <span className="block text-2xl md:text-3xl font-normal text-primary-200 mt-2">
                Digital Food Ordering System
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Pre-order your meals, skip the queue, and enjoy a seamless dining experience 
              with our advanced canteen management system.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isAdmin && (
                    <>
                      {myOrder ? (
                        <Link
                          to="/my-order"
                          className="btn-gradient bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
                        >
                          <QrCode className="w-5 h-5" />
                          <span>View My Order</span>
                        </Link>
                      ) : (
                        <Link
                          to="/order"
                          className="btn-gradient bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Order Now</span>
                        </Link>
                      )}
                    </>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="btn-gradient bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>View Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-gradient bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Status Banner */}
            {isAuthenticated && !isAdmin && (
              <div className="mt-8 inline-flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isOrderingOpen() 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{isOrderingOpen() ? 'Ordering Open Until 10 AM' : 'Ordering Closed for Today'}</span>
                </div>
                {isOrderingOpen() && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
                    <Users className="w-4 h-4" />
                    <span>{200 - orderStats.total} slots remaining</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                {isAdmin 
                  ? 'Manage orders, payments, and analyze canteen performance from your dashboard.'
                  : 'Ready to order your delicious meal for today?'
                }
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/scan"
                      className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>Scan Orders</span>
                    </Link>
                  </>
                ) : (
                  <>
                    {!myOrder && isOrderingOpen() && (
                      <Link
                        to="/order"
                        className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Place Order</span>
                      </Link>
                    )}
                    {myOrder && (
                      <Link
                        to="/my-order"
                        className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <QrCode className="w-5 h-5" />
                        <span>View Order & QR</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Smart Canteen?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of food ordering with our innovative features designed 
            to make your dining experience faster, easier, and more enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 card-hover">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your meal ordered and ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Login', description: 'Sign in with your college credentials', icon: Users },
              { step: '2', title: 'Choose', description: 'Select your preferred meal type', icon: Utensils },
              { step: '3', title: 'Pay', description: 'Complete payment online securely', icon: CreditCard },
              { step: '4', title: 'Pickup', description: 'Show QR code and collect your meal', icon: QrCode }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join hundreds of students already using Smart Canteen
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all"
            >
              <span>Login to Order</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;