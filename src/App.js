import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Order from './pages/Order';
import MyOrder from './pages/MyOrder';
import Scan from './pages/Scan';
import AdminDashboard from './pages/AdminDashboard';
import AdminPayments from './pages/AdminPayments';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Student Protected Routes */}
                <Route path="/order" element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                } />
                <Route path="/my-order" element={
                  <ProtectedRoute>
                    <MyOrder />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/scan" element={
                  <AdminRoute>
                    <Scan />
                  </AdminRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/payments" element={
                  <AdminRoute>
                    <AdminPayments />
                  </AdminRoute>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;