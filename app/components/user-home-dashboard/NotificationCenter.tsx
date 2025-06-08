'use client'; // Required for client-side interactivity in Next.js 13+

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Circle, Trash2, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/app/components/user-home-dashboard/contexts/NotificationContext';
import { getNotificationIcon, getNotificationColor } from '@/app/components/utils/notificationUtils';
import { Notification } from '@/app/components/user-home-dashboard/types/notification';

export const NotificationCenter = () => {
    const {
        notifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    const filteredNotifications = notifications.filter(notification => {
        const statusMatch = filter === 'all' ||
            (filter === 'read' && notification.isRead) ||
            (filter === 'unread' && !notification.isRead);

        const categoryMatch = categoryFilter === 'all' || notification.category === categoryFilter;

        return statusMatch && categoryMatch;
    });

    const handleSelectNotification = (id: string) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(nId => nId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
        }
    };

    const handleBulkMarkAsRead = () => {
        selectedNotifications.forEach(id => markAsRead(id));
        setSelectedNotifications([]);
    };

    const handleBulkDelete = () => {
        selectedNotifications.forEach(id => deleteNotification(id));
        setSelectedNotifications([]);
    };

    const categories = ['all', 'assignment', 'announcement', 'grade', 'system', 'reminder'];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Notification Center</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {notifications.filter(n => !n.isRead).length} unread notifications
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {selectedNotifications.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleBulkMarkAsRead}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                >
                                    Mark as Read
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Mark All Read
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Status Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {filteredNotifications.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedNotifications.length === filteredNotifications.length}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="text-sm text-gray-700">
                Select all ({filteredNotifications.length})
              </span>
                        </label>
                        {selectedNotifications.length > 0 && (
                            <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
                        )}
                    </div>
                </div>
            )}

            {/* Notifications List */}
            <div className="divide-y divide-gray-200">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            isSelected={selectedNotifications.includes(notification.id)}
                            onSelect={handleSelectNotification}
                            onMarkAsRead={markAsRead}
                            onMarkAsUnread={markAsUnread}
                            onDelete={deleteNotification}
                        />
                    ))
                ) : (
                    <div className="px-6 py-12 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications found</h3>
                        <p className="text-sm text-gray-500">
                            {filter === 'all' ? 'You have no notifications.' : `You have no ${filter} notifications.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
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