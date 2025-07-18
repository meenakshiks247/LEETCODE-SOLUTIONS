import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { 
  Home, 
  ShoppingCart, 
  QrCode, 
  BarChart3, 
  CreditCard, 
  Menu, 
  X, 
  LogOut,
  User,
  Clock,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { orderStats, isOrderingOpen } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const studentNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/order', label: 'Order', icon: ShoppingCart },
    { path: '/my-order', label: 'My Order', icon: QrCode }
  ];

  const adminNavItems = [
    { path: '/scan', label: 'Scan QR', icon: QrCode },
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Canteen</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Digital Food Ordering</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Status Indicators & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Ordering Status */}
            {isAuthenticated && !isAdmin && (
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isOrderingOpen() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{isOrderingOpen() ? 'Ordering Open' : 'Ordering Closed'}</span>
                </div>
                
                {isOrderingOpen() && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <Bell className="w-3 h-3" />
                    <span>{200 - orderStats.total} slots left</span>
                  </div>
                )}
              </div>
            )}

            {/* User Profile & Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                
                {/* User Avatar */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-gradient text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated && (
              <>
                {/* User Info Mobile */}
                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role} • {user.collegeId}</p>
                </div>

                {/* Status Indicators Mobile */}
                {!isAdmin && (
                  <div className="px-3 py-2 space-y-2 border-b border-gray-200 mb-2">
                    <div className={`flex items-center space-x-2 text-sm ${
                      isOrderingOpen() ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>{isOrderingOpen() ? 'Ordering is Open' : 'Ordering is Closed'}</span>
                    </div>
                    
                    {isOrderingOpen() && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Bell className="w-4 h-4" />
                        <span>{200 - orderStats.total} slots available today</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Items Mobile */}
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                      isActivePath(path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}

                {/* Logout Mobile */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {/* Login Mobile */}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block w-full text-center bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;