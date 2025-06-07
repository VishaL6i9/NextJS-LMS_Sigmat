'use client';
import React from 'react';
import { NotificationProvider } from '@/app/components/contexts/NotificationContext'
import { Header } from '@/app/components/home-dashboard/Header'
import { Dashboard } from '@/app/components/home-dashboard/Dashboard'
import { ToastCenter } from '@/app/components/home-dashboard/ToastCenter'

function App() {
    return (
        <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Dashboard />
                <ToastCenter />
            </div>
        </NotificationProvider>
    );
}

export default App;