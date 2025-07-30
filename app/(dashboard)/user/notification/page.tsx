import React from 'react';
import Dashboard from '@/app/components/user-notification-dashboard/Dashboard';
import ToastCenter from '@/app/components/user-notification-dashboard/ToastCenter';

export default function UserNotificationPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <Dashboard />
            </main>
            <ToastCenter />
        </div>
    );
}