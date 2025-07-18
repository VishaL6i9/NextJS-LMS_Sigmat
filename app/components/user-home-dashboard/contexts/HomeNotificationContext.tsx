'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Notification } from '@/app/components/user-home-dashboard/types/notification';
import { toast } from '@/hooks/use-toast';

// === Constants ===
const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'Assignment Due Soon',
        message: 'Your Chemistry Lab Report is due in 2 days. Make sure to submit it on time.',
        type: 'warning',
        category: 'assignment',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        actionUrl: '/assignments/chemistry-lab',
        actionText: 'View Assignment'
    },
    {
        id: '2',
        title: 'New Grade Posted',
        message: 'Your grade for Mathematics Quiz #3 has been posted. You scored 95/100!',
        type: 'success',
        category: 'grade',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/grades',
        actionText: 'View Grades'
    },
];

interface HomeNotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    userId: number;
    unreadCount: number;
}

type HomeNotificationAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'MARK_AS_UNREAD'; payload: string }
    | { type: 'MARK_ALL_AS_READ' }
    | { type: 'DELETE_NOTIFICATION'; payload: string }
    | { type: 'SET_USER_ID'; payload: number };

function homeNotificationReducer(state: HomeNotificationState, action: HomeNotificationAction): HomeNotificationState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.filter(n => !n.isRead).length
            };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + (action.payload.isRead ? 0 : 1)
            };
        case 'MARK_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, isRead: true } : n
                ),
                unreadCount: state.unreadCount - 1
            };
        case 'MARK_AS_UNREAD':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, isRead: false } : n
                ),
                unreadCount: state.unreadCount + 1
            };
        case 'MARK_ALL_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            };
        case 'DELETE_NOTIFICATION':
            const deletedNotification = state.notifications.find(n => n.id === action.payload);
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
                unreadCount: state.unreadCount - (deletedNotification?.isRead ? 0 : 1)
            };
        case 'SET_USER_ID':
            return { ...state, userId: action.payload };
        default:
            return state;
    }
}

interface HomeNotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAsUnread: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    showToast: (toastData: { title?: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => void;
}

const HomeNotificationContext = createContext<HomeNotificationContextType | undefined>(undefined);

export const HomeNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(homeNotificationReducer, {
        notifications: initialNotifications,
        loading: false,
        error: null,
        userId: 0,
        unreadCount: initialNotifications.filter(n => !n.isRead).length
    });

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
        };
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
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

    const showToast = useCallback((toastData: { title?: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => {
        toast({
            title: toastData.title,
            description: toastData.message,
            variant: toastData.type === 'error' ? 'destructive' : 'default',
        });
    }, []);

    const value: HomeNotificationContextType = {
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        loading: state.loading,
        error: state.error,
        addNotification,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        showToast,
    };

    // Remove or comment out this useEffect that generates automatic notifications
    /*
    useEffect(() => {
        const interval = setInterval(() => {
            // ... automatic notification generation code ...
        }, 30000);
        return () => clearInterval(interval);
    }, [addNotification, showToast]);
    */

    return (
        <HomeNotificationContext.Provider value={value}>
            {children}
        </HomeNotificationContext.Provider>
    );
};

export const useHomeNotifications = () => {
    const context = useContext(HomeNotificationContext);
    if (!context) {
        throw new Error('useHomeNotifications must be used within a HomeNotificationProvider');
    }
    return context;
};

// Loading component
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

export const HomeNotificationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loading } = useHomeNotifications();
    return loading ? <LoadingSpinner /> : <>{children}</>;
}; 