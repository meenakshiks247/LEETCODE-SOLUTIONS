import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Order from './pages/Order';
import MyOrder from './pages/MyOrder';
import Scan from './pages/Scan';
import AdminDashboard from './pages/AdminDashboard';
import AdminPayments from './pages/AdminPayments';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/order" 
                  element={
                    <ProtectedRoute>
                      <Order />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-order" 
                  element={
                    <ProtectedRoute>
                      <MyOrder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scan" 
                  element={
                    <AdminRoute>
                      <Scan />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/payments" 
                  element={
                    <AdminRoute>
                      <AdminPayments />
                    </AdminRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;