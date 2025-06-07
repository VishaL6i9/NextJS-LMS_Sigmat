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

export interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

export interface NotificationContextType {
    notifications: Notification[];
    toasts: Toast[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    markAsUnread: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    showToast: (toast: Omit<Toast, 'id'>) => void;
    dismissToast: (id: string) => void;
}