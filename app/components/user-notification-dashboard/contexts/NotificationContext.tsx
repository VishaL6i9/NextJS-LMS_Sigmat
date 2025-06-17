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
    case 'MARK_AS_UNREAD':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: false } : n),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
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

const API_BASE_URL = 'http://localhost:8080/api/public/notifications';

// === Helper Functions ===

const fetchStats = async (userId: number): Promise<NotificationStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
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

  // === Fetch user ID on mount ===
  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile/getuserID`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user ID');
        const id = await res.text();
        dispatch({ type: 'SET_USER_ID', payload: Number(id) });
      } catch (err) {
        console.error('Failed to fetch user ID', err);
      }
    };

    fetchUserId();
  }, []);

  const updateStats = useCallback(async () => {
    if (!state.userId) return;
    const stats = await fetchStats(state.userId);
    dispatch({ type: 'SET_STATS', payload: stats });
  }, [state.userId]);

  const fetchNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/user/${state.userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/user/${state.userId}/unread`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
      await updateStats();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch unread notifications' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  // @ts-ignore
  const addNotification = useCallback(async (notification) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}?userId=${state.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      dispatch({ type: 'ADD_NOTIFICATION', payload: data });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add notification' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  // @ts-ignore
  const addToast = useCallback((toast) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        ...toast,
        id: Date.now().toString(),
        timestamp: new Date(),
        duration: toast.duration || 5000,
        autoClose: toast.autoClose !== false,
      },
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/${id}/read`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'MARK_AS_READ', payload: id });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const markAsUnread = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/${id}/unread`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'MARK_AS_UNREAD', payload: id });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark as unread' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const markAllAsRead = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/user/${state.userId}/read-all`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'MARK_ALL_AS_READ' });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark all as read' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, updateStats]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete notification' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateStats]);

  const clearAllNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(`${API_BASE_URL}/user/${state.userId}/clear`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
      await updateStats();
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear notifications' });
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

// === Hook ===

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
