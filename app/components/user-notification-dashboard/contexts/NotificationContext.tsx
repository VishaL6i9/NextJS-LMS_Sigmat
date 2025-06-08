import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Notification, ToastNotification, NotificationStats } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  toasts: ToastNotification[];
  stats: NotificationStats;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'ADD_TOAST'; payload: ToastNotification }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_AS_UNREAD'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'UPDATE_STATS' };

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialState: NotificationState = {
  notifications: [
    {
      id: '1',
      title: 'Assignment Due Soon',
      message: 'Your JavaScript Fundamentals assignment is due in 2 hours.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      category: 'assignment',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Grade Posted',
      message: 'Your grade for React Components Quiz has been posted.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
      category: 'grade',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'New Announcement',
      message: 'Class schedule has been updated for next week.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isRead: true,
      category: 'announcement',
      priority: 'low'
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'The LMS will be under maintenance tonight from 2-4 AM.',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      isRead: true,
      category: 'system',
      priority: 'medium'
    }
  ],
  toasts: [],
  stats: { total: 0, unread: 0, today: 0, thisWeek: 0 }
};

const calculateStats = (notifications: Notification[]): NotificationStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    today: notifications.filter(n => n.timestamp >= today).length,
    thisWeek: notifications.filter(n => n.timestamp >= weekAgo).length
  };
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        stats: calculateStats(newNotifications)
      };
    }
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    case 'MARK_AS_READ': {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        stats: calculateStats(updatedNotifications)
      };
    }
    case 'MARK_AS_UNREAD': {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, isRead: false }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        stats: calculateStats(updatedNotifications)
      };
    }
    case 'MARK_ALL_AS_READ': {
      const updatedNotifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      return {
        ...state,
        notifications: updatedNotifications,
        stats: calculateStats(updatedNotifications)
      };
    }
    case 'DELETE_NOTIFICATION': {
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications,
        stats: calculateStats(filteredNotifications)
      };
    }
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        stats: { total: 0, unread: 0, today: 0, thisWeek: 0 }
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: calculateStats(state.notifications)
      };
    default:
      return state;
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    ...initialState,
    stats: calculateStats(initialState.notifications)
  });

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: Date.now().toString(),
      timestamp: new Date(),
      duration: toast.duration || 5000,
      autoClose: toast.autoClose !== false
    };
    dispatch({ type: 'ADD_TOAST', payload: newToast });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  const markAsUnread = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_UNREAD', payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, []);

  const value: NotificationContextType = {
    state,
    addNotification,
    addToast,
    removeToast,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};