export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  category?: 'assignment' | 'grade' | 'announcement' | 'system' | 'reminder';
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ToastNotification extends Omit<Notification, 'isRead'> {
  duration?: number;
  autoClose?: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
}