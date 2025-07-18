'use client';
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Notification, NotificationContextType } from '@/app/components/user-home-dashboard/types/notification';
import { toast } from '@/hooks/use-toast'; // Import shadcn toast
import {
    getUserId,
    getNotifications,
    addNotification as apiAddNotification,
    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,
    deleteNotification as apiDeleteNotification
} from '@/app/components/services/api';

// Keep the initial notifications as fallback data
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
    // ... keep other initial notifications
];

// === State and Action Types ===
interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    userId: number;
    unreadCount: number;
}

type NotificationAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'MARK_AS_UNREAD'; payload: string }
    | { type: 'MARK_ALL_AS_READ' }
    | { type: 'DELETE_NOTIFICATION'; payload: string }
    | { type: 'SET_USER_ID'; payload: number };

// === Reducer ===
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
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
            return { ...state, notifications: state.notifications.map(n => ({ ...n, isRead: true })), unreadCount: 0 };
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

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Loading component
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, {
        notifications: [], // Start with empty array, will be populated with initial data if API fails
        loading: false,
        error: null,
        userId: 0,
        unreadCount: 0
    });

    // Fetch user ID on mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userId = await getUserId();
                dispatch({ type: 'SET_USER_ID', payload: Number(userId) });
            } catch (err) {
                console.error('Failed to fetch user ID:', err);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user ID' });
            }
        };

        fetchUserId();
    }, []);

    const fetchNotifications = useCallback(async () => {
        // Don't fetch if userId is not set yet
        if (!state.userId) {
            console.log('User ID not available yet, skipping notification fetch');
            return;
        }

        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const data = await getNotifications(state.userId);

            // If we got empty data from the API, use initial notifications
            if (!data || data.length === 0) {
                dispatch({ type: 'SET_NOTIFICATIONS', payload: initialNotifications });
            } else {
                dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // On error, fall back to initial notifications
            dispatch({ type: 'SET_NOTIFICATIONS', payload: initialNotifications });
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.userId]);

    // Fetch notifications when userId changes
    useEffect(() => {
        if (state.userId) {
            fetchNotifications();
        }
    }, [state.userId, fetchNotifications]);

    const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        try {
            const data = await apiAddNotification(notification, state.userId);
            dispatch({ type: 'ADD_NOTIFICATION', payload: data });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add notification' });
        }
    }, [state.userId]);

    const showToast = useCallback((toastData: { title?: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => {
        toast({
            title: toastData.title,
            description: toastData.message,
            variant: toastData.type === 'error' ? 'destructive' : 'default',
        });
    }, []);


    const markAsRead = useCallback(async (id: string) => {
        try {
            await markNotificationAsRead(id);
            dispatch({ type: 'MARK_AS_READ', payload: id });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to mark as read' });
        }
    }, []);

    const markAsUnread = useCallback(async (id: string) => {
        try {
            await markNotificationAsUnread(id);
            dispatch({ type: 'MARK_AS_UNREAD', payload: id });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to mark as unread' });
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead(state.userId);
            dispatch({ type: 'MARK_ALL_AS_READ' });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to mark all as read' });
        }
    }, [state.userId]);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await apiDeleteNotification(id);
            dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete notification' });
        }
    }, []);

    const value: NotificationContextType = {
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

    return (
        <NotificationContext.Provider value={value}>
            {state.loading ? <LoadingSpinner /> : children}
        </NotificationContext.Provider>
    );
};

export const NotificationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('NotificationWrapper must be used within a NotificationProvider');
    }

    if (context.loading) {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};