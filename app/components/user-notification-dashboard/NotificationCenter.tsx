'use client';
import React, { useEffect, useState } from 'react';
import { Check, MoreHorizontal, Clock, BookOpen, Trophy, Megaphone, Settings as SettingsIcon, Bell } from 'lucide-react';
import { Delete } from '@/components/ui/Delete';
import { useNotifications } from './contexts/NotificationContext';
import { Notification } from './types/notification';

interface NotificationCenterProps {
  onClose?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { state, markAsRead, markAsUnread, deleteNotification, markAllAsRead, fetchNotifications, fetchUnreadNotifications } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (filter === 'unread') {
      fetchUnreadNotifications();
    } else {
      fetchNotifications();
    }
  }, [filter, fetchNotifications, fetchUnreadNotifications]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {state.error}
      </div>
    );
  }

  const filteredNotifications = state.notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    return true;
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      case 'grade':
        return <Trophy className="w-4 h-4" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      case 'system':
        return <SettingsIcon className="w-4 h-4" />;
      case 'reminder':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeStyles = (type: string, isRead: boolean) => {
    const opacity = isRead ? 'bg-opacity-30' : 'bg-opacity-50';
    switch (type) {
      case 'success':
        return `bg-green-100 ${opacity} border-green-200`;
      case 'warning':
        return `bg-yellow-100 ${opacity} border-yellow-200`;
      case 'error':
        return `bg-red-100 ${opacity} border-red-200`;
      default:
        return `bg-blue-100 ${opacity} border-blue-200`;
    }
  };

  const getTypeIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getPriorityIndicator = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'medium':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="w-full max-h-96 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({state.stats.total})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread ({state.stats.unread})
          </button>
        </div>

        {/* Actions */}
        {state.stats.unread > 0 && (
          <div className="mt-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  {/* Category Icon */}
                  <div className={`flex-shrink-0 p-2 rounded-lg border ${getTypeStyles(notification.type, notification.isRead)}`}>
                    <div className={getTypeIconColor(notification.type)}>
                      {getCategoryIcon(notification.category)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {getPriorityIndicator(notification.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.category && (
                            <span className="text-xs text-gray-500 capitalize">
                              {notification.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          <Check className={`w-4 h-4 ${notification.isRead ? 'text-gray-400' : 'text-green-600'}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          title="Delete notification"
                        >
                          <Delete width={16} height={16} stroke="currentColor" className="text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full absolute -ml-6 mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;