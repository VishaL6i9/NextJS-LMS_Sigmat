export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: Date;
  isRead: boolean;
  category?: 'assignment' | 'grade' | 'announcement' | 'system' | 'reminder' | 'ASSIGNMENT' | 'GRADE' | 'ANNOUNCEMENT' | 'SYSTEM' | 'REMINDER';
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH';
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