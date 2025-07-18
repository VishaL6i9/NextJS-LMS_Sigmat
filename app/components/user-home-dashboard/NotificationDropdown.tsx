'use client';

import { useState } from 'react';
import { useNotifications } from './contexts/NotificationContext';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export const NotificationDropdown = () => {
    const { notifications, unreadCount } = useNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative text-inherit"
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
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="p-2">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`
                                    mb-2 p-3 rounded-md cursor-pointer
                                    ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}
                                    hover:bg-gray-100 transition-colors
                                `}
                                onSelect={(e) => e.preventDefault()} // Prevent closing dropdown on item click
                            >
                                <Link href={notification.actionUrl || "#"} legacyBehavior>
                                    <a className="block w-full">
                                        <h4 className="font-medium text-sm">{notification.title}</h4>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                        {notification.actionUrl && (
                                            <span 
                                                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                                            >
                                                {notification.actionText || 'View'}
                                            </span>
                                        )}
                                    </a>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No notifications
                        </div>
                    )}
                </div>
                <div className="p-4 border-t flex justify-center">
                    <Link href="/dashboard/user-notification" legacyBehavior>
                        <a className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">View All Notifications</a>
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};