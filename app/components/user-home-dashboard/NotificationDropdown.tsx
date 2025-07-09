'use client';

import { useState } from 'react';
import { useNotifications } from './contexts/NotificationContext';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount } = useNotifications();

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Notifications</h3>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </Button>
                        </div>
                    </div>
                    <div className="p-2">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`
                                        mb-2 p-3 rounded-md
                                        ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}
                                        hover:bg-gray-100 transition-colors
                                    `}
                                >
                                    <h4 className="font-medium text-sm">{notification.title}</h4>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    {notification.actionUrl && (
                                        <a 
                                            href={notification.actionUrl}
                                            className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                                        >
                                            {notification.actionText || 'View'}
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No notifications
                            </div>
                        )}
                    </div>
                    {/* View All Notifications Button */}
                    <div className="p-4 border-t flex justify-center">
                        <Link href="/dashboard/user-notification" legacyBehavior>
                            <a className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">View All Notifications</a>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};