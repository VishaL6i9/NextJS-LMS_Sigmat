'use client';

import React from 'react';
import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import { ToastCenter } from '@/app/components/user-home-dashboard/ToastCenter';

export default function UserHome() {
    return (
        <div>
            <Dashboard />
            <ToastCenter />
        </div>
    );
}