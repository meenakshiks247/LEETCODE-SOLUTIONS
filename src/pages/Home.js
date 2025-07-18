import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { 
  Clock, 
  Users, 
  CreditCard, 
  BarChart3, 
  QrCode,
  CheckCircle,
  ArrowRight,
  UtensilsCrossed,
  Timer,
  Bell
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { getTodayStats, isOrderingOpen, CUTOFF_TIME } = useOrder();
  const stats = getTodayStats();

  const features = [
    {
      icon: Clock,
      title: 'Pre-Order Meals',
      description: 'Order your meals before 10:00 AM and skip the queue',
      color: 'text-primary-600'
    },
    {
      icon: QrCode,
      title: 'Digital Queue',
      description: 'Get your time slot and QR code for quick pickup',
      color: 'text-secondary-600'
    },
    {
      icon: CreditCard,
      title: 'Digital Payments',
      description: 'Pay online with UPI and track your payment status',
      color: 'text-warning-600'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Real-time demand tracking and optimized service',
      color: 'text-danger-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Canteen System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Pre-order meals, skip queues, and enjoy seamless digital dining experience
            </p>
            
            {/* Status Indicator */}
            <div className="mb-8">
              {isOrderingOpen() ? (
                <div className="inline-flex items-center space-x-2 bg-secondary-600 text-white px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                  <span>Ordering Open until {CUTOFF_TIME} AM</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-danger-600 text-white px-4 py-2 rounded-full">
                  <Timer className="h-5 w-5" />
                  <span>Ordering Closed - Opens tomorrow at 6:00 AM</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/order" className="btn-success text-lg px-8 py-4">
                    <UtensilsCrossed className="h-5 w-5" />
                    Order Now
                  </Link>
                  <Link to="/my-order" className="btn-secondary text-lg px-8 py-4">
                    <QrCode className="h-5 w-5" />
                    My Order
                  </Link>
                </>
              ) : (
                <Link to="/login" className="btn-success text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {isAuthenticated && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.totalOrders}
                </div>
                <div className="text-gray-600">Orders Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  {stats.spotsLeft}
                </div>
                <div className="text-gray-600">Spots Left</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-600 mb-2">
                  ₹{stats.revenue}
                </div>
                <div className="text-gray-600">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-danger-600 mb-2">
                  {stats.waitlistCount}
                </div>
                <div className="text-gray-600">Waitlisted</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Canteen?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of college dining with our innovative features designed to save time and enhance your meal experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${feature.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 4-step process to get your meal
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Login & Order',
                description: 'Sign in with your college ID and select your meal preference before 10:00 AM',
                icon: Users
              },
              {
                step: '2',
                title: 'Get Time Slot',
                description: 'Receive your designated time slot and QR code for pickup',
                icon: Clock
              },
              {
                step: '3',
                title: 'Make Payment',
                description: 'Pay ₹40 online using UPI or other digital payment methods',
                icon: CreditCard
              },
              {
                step: '4',
                title: 'Pickup Meal',
                description: 'Show your QR code during your time slot and collect your meal',
                icon: QrCode
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <Icon className="h-8 w-8 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join hundreds of students already using Smart Canteen
            </p>
            <Link to="/login" className="btn-success text-lg px-8 py-4">
              <Bell className="h-5 w-5" />
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;