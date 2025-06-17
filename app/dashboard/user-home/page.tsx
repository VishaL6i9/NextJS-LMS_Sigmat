'use client';

import React from 'react';
import { NotificationProvider } from '@/app/components/user-home-dashboard/contexts/NotificationContext';
import Header from '@/app/components/user-home-dashboard/Header';
import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import { ToastCenter } from '@/app/components/user-home-dashboard/ToastCenter';
import { HomeNotificationProvider } from '@/app/components/user-home-dashboard/contexts/HomeNotificationContext';

export default function UserHome() {
    return (
        <HomeNotificationProvider>
            <NotificationProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <Dashboard />
                    <ToastCenter />
                </div>
            </NotificationProvider>
        </HomeNotificationProvider>
    );
}