'use client';
import React from 'react';
import { NotificationProvider } from '@/app/components/user-notification-dashboard/contexts/NotificationContext';
import MergedNavbar from '@/app/components/user-notification-dashboard/MergedNavbar';
import Dashboard from '@/app/components/user-notification-dashboard/Dashboard';
import ToastCenter from '@/app/components/user-notification-dashboard/ToastCenter';

export default function UserNotificationPage() {
    return (
        <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
                <MergedNavbar />
                <main>
                    <Dashboard />
                </main>
                <ToastCenter />
            </div>
        </NotificationProvider>
    );
}