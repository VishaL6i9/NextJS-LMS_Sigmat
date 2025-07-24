'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import {
  Notification,
  ToastNotification,
  NotificationStats,
} from '../types/notification';
import {
  getUserId,
  getNotifications,
  getUnreadNotifications,
  addNotification as apiAddNotification,
  addBulkNotifications as apiAddBulkNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStats,
} from '@/app/components/services/api';

// === State and Action Types ===

interface NotificationState {
  notifications: Notification[];
  toasts: ToastNotification[];
  stats: NotificationStats;
  loading: boolean;
  error: string | null;
  userId: number;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_STATS'; payload: NotificationStats }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'ADD_TOAST'; payload: ToastNotification }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_AS_UNREAD'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'SET_USER_ID'; payload: number };

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Promise<void>;
  addBulkNotifications: (notification: Omit<Notification, 'id' | 'timestamp'>, userIds: number[]) => Promise<void>;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAllNotifications: () => void;
  fetchNotifications: (userId?: number) => Promise<void>;
  fetchUnreadNotifications: (userId?: number) => Promise<void>;
}

// === Reducer ===

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    default:
      return state;
  }
}

// === Context ===

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// === Constants ===

const API_BASE_URL = 'http://localhost:8080/api/notifications';

// === Helper Functions ===

const fetchStats = async (userId: number): Promise<NotificationStats> => {
  try {
    return await getNotificationStats(userId);
  } catch {
    return { total: 0, unread: 0, today: 0, thisWeek: 0 };
  }
};

// === Provider ===

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    toasts: [],
    stats: { total: 0, unread: 0, today: 0, thisWeek: 0 },
    loading: false,
    error: null,
    userId: 0,
  });

  const addToast = useCallback((toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        ...toast,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date(),
        duration: toast.duration || 5000,
        autoClose: toast.autoClose !== false,
      },
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // Fetch user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        const parsedId = Number(id);
        console.log('User ID fetched:', parsedId);
        dispatch({ type: 'SET_USER_ID', payload: parsedId });
      } catch (err) {
        console.error('Error fetching user ID:', err);
      }
    };

    fetchUserId();
  }, []);

  const updateStats = useCallback(async (userId: number) => {
    if (!userId) return;

    try {
      const stats = await getNotificationStats(userId);
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async (userId: number) => {
    if (!userId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Fetching notifications for user:', userId);
      const data = await getNotifications(userId);
      console.log('Notifications fetched successfully:', data);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats(userId); // Update stats after fetching notifications
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const fetchUnreadNotifications = useCallback(async (userId?: number) => {
    const targetUserId = userId || state.userId;
    if (!targetUserId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await getUnreadNotifications(targetUserId);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats(targetUserId);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch unread notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats, state.userId]);

  // Fetch notifications and stats when userId changes
  useEffect(() => {
    if (state.userId) {
      fetchNotifications(state.userId);
      updateStats(state.userId);
    }
  }, [state.userId, fetchNotifications, updateStats]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const currentUserId = state.userId;
    if (!currentUserId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await apiAddNotification(notification, currentUserId);

      dispatch({ type: 'ADD_NOTIFICATION', payload: data });
      await updateStats(currentUserId); // Update stats after adding notification

      // Show toast for new notification
      /* showToast({
         title: 'New Notification',
         message: notification.title,
         type: 'info',
       });
       */
    } catch (error) {
      console.error('Failed to add notification:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add notification' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const addBulkNotifications = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>, userIds: number[]) => {
    const currentUserId = state.userId;
    if (!currentUserId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await apiAddBulkNotifications(notification, userIds);

      // Add all notifications to the state
      data.forEach((notification: Notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      await updateStats(currentUserId);

      addToast({
        title: 'Success',
        message: `Sent notifications to ${userIds.length} users`,
        type: 'SUCCESS'
      });
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send bulk notifications' });

      addToast({
        title: 'Error',
        message: 'Failed to send bulk notifications',
        type: 'ERROR'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats, addToast]);

  const markAsRead = useCallback(async (id: string) => {
    const currentUserId = state.userId;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await markNotificationAsRead(id);
      dispatch({ type: 'MARK_AS_READ', payload: id });
      if (currentUserId) await updateStats(currentUserId); // Update stats after marking as read
    } catch (error) {
      console.error('Failed to mark as read:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const markAllAsRead = useCallback(async () => {
    const currentUserId = state.userId;
    if (!currentUserId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await markAllNotificationsAsRead(currentUserId);
      dispatch({ type: 'MARK_ALL_AS_READ' });
      await updateStats(currentUserId); // Update stats after marking all as read
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark all as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const clearAllNotifications = useCallback(async () => {
    const currentUserId = state.userId;
    if (!currentUserId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/user/${currentUserId}/clear`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      await updateStats(currentUserId);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  // Wrapper functions to maintain the original interface
  const fetchNotificationsWrapper = useCallback(async (userId?: number) => {
    const targetUserId = userId || state.userId;
    if (targetUserId) {
      await fetchNotifications(targetUserId);
    }
  }, [fetchNotifications]);

  const value: NotificationContextType = {
    state,
    addNotification,
    addBulkNotifications,
    addToast,
    removeToast,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    fetchNotifications: fetchNotificationsWrapper,
    fetchUnreadNotifications: fetchUnreadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// === Hook ===

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
