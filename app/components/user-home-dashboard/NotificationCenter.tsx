'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Circle, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { useHomeNotifications, HomeNotificationWrapper } from './contexts/HomeNotificationContext';
import { getNotificationIcon, getNotificationColor } from '@/app/components/utils/notificationUtils';
import { Notification } from '@/app/components/user-home-dashboard/types/notification';
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
}) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
        <div className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
            !notification.isRead ? 'bg-blue-50/30' : ''
        }`}>
            <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <Checkbox
                    checked={notification.isRead}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            onMarkAsRead(notification.id);
                        } else {
                            onMarkAsUnread(notification.id);
                        }
                    }}
                    className="mt-1"
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
                                    <a
                                        href={notification.actionUrl}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                                    >
                                        <span>{notification.actionText}</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => {
                                    notification.isRead ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id);
                                }}>
                                    {notification.isRead ? <Circle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    <span>Mark as {notification.isRead ? 'unread' : 'read'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NotificationCenter: React.FC = () => {
    const { 
        notifications,
        markAsRead,
        markAsUnread,
        deleteNotification
    } = useHomeNotifications();

    return (
        <HomeNotificationWrapper>
            <div className="notifications-container">
                {notifications.map((notification) => (
                    <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onMarkAsUnread={markAsUnread}
                        onDelete={deleteNotification}
                    />
                ))}
            </div>
        </HomeNotificationWrapper>
    );
};