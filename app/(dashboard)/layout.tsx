// app/(dashboard)/layout.tsx
'use client';

import React from 'react';
import { NotificationProvider } from '@/app/components/user-home-dashboard/contexts/NotificationContext';
import { HomeNotificationProvider } from '@/app/components/user-home-dashboard/contexts/HomeNotificationContext';
import DashboardNavbar from '@/app/components/dashboard-navbar/DashboardNavbar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NotificationProvider>
                <HomeNotificationProvider>
                    {/* <DashboardNavbar /> */}
                    
                    <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {children}
                    </main>
                </HomeNotificationProvider>
            </NotificationProvider>
        </div>
    );
};

export default DashboardLayout;
