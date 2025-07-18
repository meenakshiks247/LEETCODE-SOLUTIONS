import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('canteen_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('canteen_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API call
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'student',
        collegeId: email.includes('admin') ? null : `ST${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('canteen_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now(),
        email: 'student@college.edu',
        name: 'John Doe',
        role: 'student',
        collegeId: `ST${Math.floor(Math.random() * 10000)}`,
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
        createdAt: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('canteen_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('canteen_user');
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}