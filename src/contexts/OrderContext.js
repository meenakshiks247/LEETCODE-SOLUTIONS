import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [myOrder, setMyOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('canteen_orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        
        // Find current user's order
        if (user) {
          const userOrder = parsedOrders.find(order => order.userId === user.id);
          setMyOrder(userOrder || null);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, [user]);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
  }, [orders]);

  const isOrderingOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    // Ordering is open until 10 AM
    return hour < 10;
  };

  const getAvailableSlots = () => {
    // Slots from 12:00 PM to 2:00 PM in 15-minute intervals
    const slots = [];
    for (let hour = 12; hour < 14; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotOrders = orders.filter(order => order.slot === timeString);
        slots.push({
          time: timeString,
          available: slotOrders.length < 20, // Max 20 orders per slot
          count: slotOrders.length
        });
      }
    }
    return slots;
  };

  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const generateQRCode = (order) => {
    return JSON.stringify({
      orderId: order.id,
      userId: order.userId,
      userName: order.userName,
      mealType: order.mealType,
      slot: order.slot,
      amount: order.amount,
      createdAt: order.createdAt
    });
  };

  const createOrder = async (orderData) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (!isOrderingOpen()) {
      return { success: false, error: 'Ordering is closed for today' };
    }

    if (orders.length >= 200) {
      return { success: false, error: 'Daily order limit reached' };
    }

    // Check if user already has an order today
    const existingOrder = orders.find(order => 
      order.userId === user.id && 
      order.createdAt.startsWith(new Date().toISOString().split('T')[0])
    );

    if (existingOrder) {
      return { success: false, error: 'You already have an order for today' };
    }

    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign next available slot
      const availableSlots = getAvailableSlots();
      const nextSlot = availableSlots.find(slot => slot.available);

      if (!nextSlot) {
        return { success: false, error: 'No available slots for today' };
      }

      const newOrder = {
        id: generateOrderId(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        collegeId: user.collegeId,
        mealType: orderData.mealType,
        slot: nextSlot.time,
        amount: 40, // Fixed price
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        servedAt: null,
        createdAt: new Date().toISOString(),
        qrCode: null
      };

      // Generate QR code data
      newOrder.qrCode = generateQRCode(newOrder);

      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      setMyOrder(newOrder);

      return { success: true, order: newOrder };
    } catch (error) {
      return { success: false, error: 'Failed to create order' };
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = (orderId, status) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus: status }
          : order
      )
    );
    
    if (myOrder && myOrder.id === orderId) {
      setMyOrder(prev => ({ ...prev, paymentStatus: status }));
    }
  };

  const markOrderAsServed = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              orderStatus: 'served',
              servedAt: new Date().toISOString()
            }
          : order
      )
    );
  };

  const getOrderStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.createdAt.startsWith(today)
    );

    const vegOrders = todayOrders.filter(order => order.mealType === 'veg').length;
    const nonVegOrders = todayOrders.filter(order => order.mealType === 'nonveg').length;
    const paidOrders = todayOrders.filter(order => order.paymentStatus === 'paid').length;
    const pendingPayments = todayOrders.filter(order => order.paymentStatus === 'pending').length;
    const servedOrders = todayOrders.filter(order => order.orderStatus === 'served').length;

    return {
      total: todayOrders.length,
      veg: vegOrders,
      nonVeg: nonVegOrders,
      paid: paidOrders,
      pendingPayments,
      served: servedOrders,
      revenue: paidOrders * 40,
      pendingRevenue: pendingPayments * 40
    };
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyOrders = orders.filter(order => 
      new Date(order.createdAt) >= weekAgo
    );

    const dailyStats = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = weeklyOrders.filter(order => 
        order.createdAt.startsWith(dateStr)
      );
      
      dailyStats[dateStr] = {
        total: dayOrders.length,
        veg: dayOrders.filter(order => order.mealType === 'veg').length,
        nonVeg: dayOrders.filter(order => order.mealType === 'nonveg').length,
        revenue: dayOrders.filter(order => order.paymentStatus === 'paid').length * 40
      };
    }

    return dailyStats;
  };

  const getHourlyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.createdAt.startsWith(today)
    );

    const hourlyStats = {};
    for (let hour = 0; hour < 24; hour++) {
      const hourOrders = todayOrders.filter(order => {
        const orderHour = new Date(order.createdAt).getHours();
        return orderHour === hour;
      });
      
      hourlyStats[hour] = hourOrders.length;
    }

    return hourlyStats;
  };

  const value = {
    orders,
    myOrder,
    loading,
    createOrder,
    updatePaymentStatus,
    markOrderAsServed,
    isOrderingOpen,
    getAvailableSlots,
    getOrderStats,
    getWeeklyStats,
    getHourlyStats,
    availableSlots: getAvailableSlots(),
    orderStats: getOrderStats()
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};