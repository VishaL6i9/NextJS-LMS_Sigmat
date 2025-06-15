'use client';
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Notification, ToastNotification, NotificationStats } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  toasts: ToastNotification[];
  stats: NotificationStats ;
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
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Promise<void>;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  fetchNotifications: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
}
useEffect(() => {
      const token = localStorage.getItem('userToken');
      setUserToken(token);
  }, []);

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
const getuserID = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile/getuserID`, {
  method: "GET",
  headers: {
      'Authorization': `Bearer ${token}`,
  },
});

if (!getuserID.ok) {
  throw new Error("Failed to fetch user ID");
}

const userID = await getuserID.text();

const initialState: NotificationState = {
  notifications: [],
  toasts: [],
  stats: { total: 0, unread: 0, today: 0, thisWeek: 0 },
  loading: false,
  error: null,
  userId: Number(userID),
};
const API_BASE_URL = 'http://localhost:8080/api/public/notifications';

const fetchStats = async (userId: number): Promise<NotificationStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch notification stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, unread: 0, today: 0, thisWeek: 0 };
  }
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    case 'ADD_NOTIFICATION': {
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications
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
        notifications: updatedNotifications
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
        notifications: updatedNotifications
      };
    }
    case 'MARK_ALL_AS_READ': {
      const updatedNotifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      return {
        ...state,
        notifications: updatedNotifications
      };
    }
    case 'DELETE_NOTIFICATION': {
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications
      };
    }
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    ...initialState,
    stats: { total: 0, unread: 0, today: 0, thisWeek: 0 }
  });

  const updateStats = useCallback(async () => {
    try {
      const stats = await fetchStats(state.userId);
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }, [state.userId]);

  const fetchNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/user/${state.userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/user/${state.userId}/unread`);
      if (!response.ok) throw new Error('Failed to fetch unread notifications');
      const data = await response.json();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}?userId=${state.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
      if (!response.ok) throw new Error('Failed to create notification');
      const newNotification = await response.json();
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);



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

  const markAsRead = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/${id}/read`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      dispatch({ type: 'MARK_AS_READ', payload: id });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const markAsUnread = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/${id}/unread`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to mark notification as unread');
      dispatch({ type: 'MARK_AS_UNREAD', payload: id });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const markAllAsRead = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/user/${state.userId}/read-all`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      dispatch({ type: 'MARK_ALL_AS_READ' });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const clearAllNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/user/${state.userId}/clear`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to clear all notifications');
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      await updateStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

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
    fetchNotifications,
    fetchUnreadNotifications,
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