"use client";

import SuperAdminDashboard from '@/app/components/super-admin-dashboard/SuperAdminDashboard';
import { withRoleProtection } from '@/app/components/auth/withRoleProtection';
import MergedNavbar from '@/app/components/user-home-dashboard/MergedNavbar';

export default function SuperAdminHome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <MergedNavbar />
            <SuperAdminDashboard />
        </div>
    );
}
