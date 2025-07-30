'use client';

import { Dashboard } from '@/app/components/user-home-dashboard/Dashboard';
import MergedNavbar from '@/app/components/user-home-dashboard/MergedNavbar';

const UserHomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <MergedNavbar />
            <Dashboard />
        </div>
    );
};

export default UserHomePage;