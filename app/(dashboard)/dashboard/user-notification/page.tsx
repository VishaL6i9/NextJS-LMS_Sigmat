'use client';
import React from 'react';
import { NotificationProvider } from '@/app/components/user-notification-dashboard/contexts/NotificationContext';
import DashboardNavbar from '@/app/components/dashboard-navbar/DashboardNavbar';
import Dashboard from '@/app/components/user-notification-dashboard/Dashboard';
import ToastCenter from '@/app/components/user-notification-dashboard/ToastCenter';

export default function UserNotificationPage() {
    return (
        <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
                <DashboardNavbar />
                <main>
                    <Dashboard />
                </main>
                <ToastCenter />
            </div>
        </NotificationProvider>
    );
}