'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification, Toast, NotificationContextType } from '@/app/components/types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'Assignment Due Soon',
        message: 'Your Chemistry Lab Report is due in 2 days. Make sure to submit it on time.',
        type: 'warning',
        category: 'assignment',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
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
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        actionUrl: '/grades',
        actionText: 'View Grades'
    },
    {
        id: '3',
        title: 'Course Announcement',
        message: 'Important: Next week\'s Physics lecture has been moved to Thursday at 2 PM.',
        type: 'info',
        category: 'announcement',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
        id: '4',
        title: 'System Maintenance',
        message: 'The LMS will undergo scheduled maintenance this Sunday from 2-4 AM EST.',
        type: 'info',
        category: 'system',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        id: '5',
        title: 'Assignment Submitted',
        message: 'Your English Essay has been successfully submitted for review.',
        type: 'success',
        category: 'assignment',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAsUnread = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const deleteNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const newToast: Toast = {
            ...toast,
            id: Date.now().toString(),
            duration: toast.duration || 5000,
        };
        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss toast
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, newToast.duration);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Simulate receiving new notifications periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const randomNotifications = [
                {
                    title: 'New Discussion Post',
                    message: 'A new post has been added to the Biology forum.',
                    type: 'info' as const,
                    category: 'announcement' as const,
                    isRead: false,
                },
                {
                    title: 'Reminder',
                    message: 'Don\'t forget about tomorrow\'s study group meeting at 3 PM.',
                    type: 'info' as const,
                    category: 'reminder' as const,
                    isRead: false,
                },
            ];

            if (Math.random() < 0.3) { // 30% chance every 30 seconds
                const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
                addNotification(randomNotification);
                showToast({
                    title: 'New Notification',
                    message: randomNotification.title,
                    type: 'info',
                });
            }
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [addNotification, showToast]);

    const value: NotificationContextType = {
        notifications,
        toasts,
        unreadCount,
        addNotification,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        showToast,
        dismissToast,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};