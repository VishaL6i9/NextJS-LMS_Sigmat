export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: Date;
  isRead: boolean;
  category?: 'ASSIGNMENT' | 'GRADE' | 'ANNOUNCEMENT' | 'SYSTEM' | 'REMINDER' | 'PAYMENT';
  actionUrl?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
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
