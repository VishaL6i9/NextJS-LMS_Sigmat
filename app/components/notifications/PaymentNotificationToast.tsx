'use client';

import React, { useEffect, useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/app/components/user-notification-dashboard/types/notification';

interface PaymentNotificationToastProps {
  notification: Notification;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const PaymentNotificationToast: React.FC<PaymentNotificationToastProps> = ({
  notification,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return 'text-green-800';
      case 'ERROR':
        return 'text-red-800';
      case 'WARNING':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${getTextColor()}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
                {notification.message}
              </p>
              
              {notification.actionUrl && (
                <button
                  onClick={() => window.location.href = notification.actionUrl!}
                  className={`text-xs mt-2 underline ${getTextColor()} hover:opacity-80`}
                >
                  View Details
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar for auto-close */}
          {autoClose && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${
                notification.type === 'SUCCESS' ? 'bg-green-400' :
                notification.type === 'ERROR' ? 'bg-red-400' :
                notification.type === 'WARNING' ? 'bg-yellow-400' :
                'bg-blue-400'
              } rounded-bl-lg`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing payment notifications
export const usePaymentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

// Payment notification manager component
export const PaymentNotificationManager: React.FC = () => {
  const { notifications, removeNotification } = usePaymentNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <PaymentNotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};