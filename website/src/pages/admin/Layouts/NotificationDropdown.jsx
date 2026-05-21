import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useSocket } from '../../../hooks/useSocket.js';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_customer':
        return '👤';
      case 'new_order':
        return '📦';
      case 'product_review':
        return '⭐';
      case 'product_question':
        return '❓';
      case 'delivery_completed':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'new_customer':
        return '/admin/customers';
      case 'new_order':
        return '/admin/orders';
      case 'product_review':
        return `/admin/products?review=${notification.data.productId}`;
      case 'product_question':
        return `/admin/products?question=${notification.data.productId}`;
      case 'delivery_completed':
        return `/admin/orders/${notification.data.orderId}`;
      default:
        return '#';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'এখনই';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    
    return date.toLocaleDateString('bn-BD');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    window.location.href = getNotificationLink(notification);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#4a154a]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-orange-400" />
                <h3 className="text-white font-bold text-sm">নোটিফিকেশন</h3>
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount} নতুন
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Check size={12} />
                  সব পড়া হয়েছে
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40 text-sm">কোন নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-white/3' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-bold text-sm mb-1">
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification._id)}
                          className="text-white/30 hover:text-red-400 p-1 rounded-lg hover:bg-white/5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 bg-white/2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-white/60 hover:text-white text-sm py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;