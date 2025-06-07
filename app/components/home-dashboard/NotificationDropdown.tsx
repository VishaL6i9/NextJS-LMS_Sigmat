'use client';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, X, ExternalLink } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { getNotificationIcon, getNotificationColor } from '../utils/notificationUtils';

interface NotificationDropdownProps {
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const recentNotifications = notifications.slice(0, 5);

    const handleNotificationClick = (id: string, isRead: boolean) => {
        if (!isRead) {
            markAsRead(id);
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type);
                        const colorClass = getNotificationColor(notification.type);

                        return (
                            <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                    notification.isRead ? 'border-transparent' : colorClass.border
                                } transition-colors`}
                                onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-1 rounded-full ${colorClass.bg}`}>
                                        <Icon className={`h-4 w-4 ${colorClass.text}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium ${
                                                notification.isRead ? 'text-gray-600' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                            </p>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className={`text-xs mt-1 ${
                                            notification.isRead ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                                            {notification.actionUrl && (
                                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                                                    <span>{notification.actionText}</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No notifications</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
                <div className="border-t border-gray-100 px-4 py-2">
                    <button
                        onClick={onClose}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center"
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};