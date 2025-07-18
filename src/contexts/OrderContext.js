import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Constants
  const MAX_ORDERS = 200;
  const CUTOFF_TIME = '10:00';

  useEffect(() => {
    // Load orders from localStorage on mount
    const savedOrders = localStorage.getItem('canteen_orders');
    const savedCurrentOrder = localStorage.getItem('canteen_current_order');
    const savedWaitlist = localStorage.getItem('canteen_waitlist');

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing saved orders:', error);
      }
    }

    if (savedCurrentOrder) {
      try {
        setCurrentOrder(JSON.parse(savedCurrentOrder));
      } catch (error) {
        console.error('Error parsing saved current order:', error);
      }
    }

    if (savedWaitlist) {
      try {
        setWaitlist(JSON.parse(savedWaitlist));
      } catch (error) {
        console.error('Error parsing saved waitlist:', error);
      }
    }
  }, []);

  const isOrderingOpen = () => {
    const now = new Date();
    const cutoffTime = new Date();
    const [hours, minutes] = CUTOFF_TIME.split(':');
    cutoffTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return now < cutoffTime;
  };

  const getAvailableSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(12, 0, 0, 0); // Start at 12:00 PM

    for (let i = 0; i < 8; i++) { // 8 slots of 15 minutes each (2 hours)
      const slotStart = new Date(startTime);
      slotStart.setMinutes(startTime.getMinutes() + (i * 15));
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + 15);

      const slotOrders = orders.filter(order => order.slot === `${slotStart.getHours()}:${slotStart.getMinutes().toString().padStart(2, '0')}`);
      
      slots.push({
        id: i,
        time: `${slotStart.getHours()}:${slotStart.getMinutes().toString().padStart(2, '0')} - ${slotEnd.getHours()}:${slotEnd.getMinutes().toString().padStart(2, '0')}`,
        slot: `${slotStart.getHours()}:${slotStart.getMinutes().toString().padStart(2, '0')}`,
        available: slotOrders.length < 25, // Max 25 orders per slot
        count: slotOrders.length
      });
    }

    return slots;
  };

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      // Check if ordering is still open
      if (!isOrderingOpen()) {
        throw new Error('Ordering is closed. Orders must be placed before 10:00 AM.');
      }

      // Check if max orders reached
      if (orders.length >= MAX_ORDERS) {
        // Add to waitlist
        const waitlistEntry = {
          id: Date.now(),
          userId: orderData.userId,
          userName: orderData.userName,
          email: orderData.email,
          mealType: orderData.mealType,
          timestamp: new Date().toISOString(),
          position: waitlist.length + 1
        };

        const newWaitlist = [...waitlist, waitlistEntry];
        setWaitlist(newWaitlist);
        localStorage.setItem('canteen_waitlist', JSON.stringify(newWaitlist));
        
        return { 
          success: false, 
          waitlisted: true, 
          position: waitlistEntry.position,
          message: `You've been added to the waitlist at position ${waitlistEntry.position}` 
        };
      }

      // Assign slot based on current order count
      const availableSlots = getAvailableSlots();
      const nextSlot = availableSlots.find(slot => slot.available);

      if (!nextSlot) {
        throw new Error('No available slots for today.');
      }

      // Create order
      const newOrder = {
        id: Date.now(),
        userId: orderData.userId,
        userName: orderData.userName,
        email: orderData.email,
        collegeId: orderData.collegeId,
        mealType: orderData.mealType,
        slot: nextSlot.slot,
        slotDisplay: nextSlot.time,
        price: 40,
        paymentStatus: 'unpaid',
        orderStatus: 'confirmed',
        timestamp: new Date().toISOString(),
        qrCode: `ORDER-${Date.now()}-${orderData.userId}`,
        served: false
      };

      const newOrders = [...orders, newOrder];
      setOrders(newOrders);
      setCurrentOrder(newOrder);
      
      localStorage.setItem('canteen_orders', JSON.stringify(newOrders));
      localStorage.setItem('canteen_current_order', JSON.stringify(newOrder));

      return { success: true, order: newOrder };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = (orderId, status) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('canteen_orders', JSON.stringify(updatedOrders));

    if (currentOrder && currentOrder.id === orderId) {
      const updatedCurrentOrder = { ...currentOrder, paymentStatus: status };
      setCurrentOrder(updatedCurrentOrder);
      localStorage.setItem('canteen_current_order', JSON.stringify(updatedCurrentOrder));
    }
  };

  const markOrderServed = (orderId) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, served: true, servedAt: new Date().toISOString() } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('canteen_orders', JSON.stringify(updatedOrders));
  };

  const cancelOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('canteen_orders', JSON.stringify(updatedOrders));

    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder(null);
      localStorage.removeItem('canteen_current_order');
    }

    // Move first waitlisted user to orders if there's space
    if (waitlist.length > 0) {
      // This would typically trigger a notification to the waitlisted user
      console.log('Notifying waitlisted user:', waitlist[0]);
    }
  };

  const getUserOrder = (userId) => {
    return orders.find(order => order.userId === userId);
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    );

    return {
      totalOrders: todayOrders.length,
      paidOrders: todayOrders.filter(order => order.paymentStatus === 'paid').length,
      unpaidOrders: todayOrders.filter(order => order.paymentStatus === 'unpaid').length,
      servedOrders: todayOrders.filter(order => order.served).length,
      revenue: todayOrders.filter(order => order.paymentStatus === 'paid').length * 40,
      waitlistCount: waitlist.length,
      spotsLeft: Math.max(0, MAX_ORDERS - todayOrders.length)
    };
  };

  const value = {
    orders,
    currentOrder,
    waitlist,
    loading,
    MAX_ORDERS,
    CUTOFF_TIME,
    isOrderingOpen,
    getAvailableSlots,
    createOrder,
    updatePaymentStatus,
    markOrderServed,
    cancelOrder,
    getUserOrder,
    getTodayStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}