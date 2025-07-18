'use client';

import React from 'react';
import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import MergedNavbar from '@/app/components/user-home-dashboard/MergedNavbar';
import { NotificationProvider } from '@/app/components/user-home-dashboard/contexts/NotificationContext';

export default function UserHome() {
    return (
        <div>
            <MergedNavbar />
            <NotificationProvider>
                <Dashboard />
            </NotificationProvider>
        </div>
    );
}