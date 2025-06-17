'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Circle, Trash2, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { useHomeNotifications, HomeNotificationWrapper } from './contexts/HomeNotificationContext';
import { getNotificationIcon, getNotificationColor } from '@/app/components/utils/notificationUtils';
import { Notification } from '@/app/components/user-home-dashboard/types/notification';

function NotificationItem(props: {
    notification: Notification,
    onMarkAsRead: (id: string) => void,
    onDelete: (id: string) => void
}) {
    return null;
}

export const NotificationCenter: React.FC = () => {
    const { 
        notifications, 
        addNotification, 
        markAsRead, 
        deleteNotification 
    } = useHomeNotifications();

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
    };

    // @ts-ignore
    return (
        <HomeNotificationWrapper>
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={deleteNotification}
                    />
                ))}
            </div>
        </HomeNotificationWrapper>
    );
};

interface NotificationCardProps {
    notification: Notification;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationCard = ({
                              notification,
                              isSelected,
                              onSelect,
                              onMarkAsRead,
                              onMarkAsUnread,
                              onDelete,
                          }: NotificationCardProps) => {
    const [showActions, setShowActions] = useState(false);
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
        <div className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
            !notification.isRead ? 'bg-blue-50/30' : ''
        }`}>
            <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(notification.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />

                {/* Icon */}
                <div className={`p-2 rounded-full ${colorClass.bg} flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${colorClass.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className={`text-sm font-medium ${
                                    notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                    {notification.title}
                                </h3>
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                <span className={`px-2 py-1 text-xs rounded-full ${colorClass.bg} ${colorClass.text}`}>
                  {notification.category}
                </span>
                            </div>
                            <p className={`text-sm mt-1 ${
                                notification.isRead ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                                {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-3">
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

                        {/* Actions Menu */}
                        <div className="relative ml-4">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>

                            {showActions && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={() => {
                                            notification.isRead ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id);
                                            setShowActions(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        {notification.isRead ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        <span>Mark as {notification.isRead ? 'unread' : 'read'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(notification.id);
                                            setShowActions(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};