'use client';

import React from 'react';
import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import { ToastCenter } from '@/app/components/user-home-dashboard/ToastCenter';
import { HomeNotificationProvider } from '@/app/components/user-home-dashboard/contexts/HomeNotificationContext';

export default function UserHome() {
    return (
        <HomeNotificationProvider>
            <div>
                <Dashboard />
                <ToastCenter />
            </div>
        </HomeNotificationProvider>
    );
}