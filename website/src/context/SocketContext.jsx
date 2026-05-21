import  { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:5001', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socketInstance;

    const handleConnect = () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      socketInstance.emit('join_admin');
    };

    const handleNewNotification = (data) => {
      console.log('New notification received:', data);
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(data.unreadCount);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('new_notification', handleNewNotification);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('new_notification', handleNewNotification);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
      socketInstance.disconnect();
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        // Update unread count if needed
        const deletedNotif = notifications.find(n => n._id === notificationId);
        if (deletedNotif && !deletedNotif.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/notifications?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};