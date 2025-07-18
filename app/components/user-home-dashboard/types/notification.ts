export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    category: 'assignment' | 'announcement' | 'grade' | 'system' | 'reminder';
    isRead: boolean;
    timestamp: Date;
    actionUrl?: string;
    actionText?: string;
}

export interface NotificationContextType {
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