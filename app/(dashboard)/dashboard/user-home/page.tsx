'use client';

import React from 'react';
import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import { ToastCenter } from '@/app/components/user-home-dashboard/ToastCenter';
import MergedNavbar from '@/app/components/user-home-dashboard/MergedNavbar';

export default function UserHome() {
    return (
        <div>
            <MergedNavbar />
            <Dashboard />
            <ToastCenter />
        </div>
    );
}