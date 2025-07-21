import { NotificationProvider } from '@/app/components/user-home-dashboard/contexts/NotificationContext';
import { HomeNotificationProvider } from '@/app/components/user-home-dashboard/contexts/HomeNotificationContext';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NotificationProvider>
                <HomeNotificationProvider>
                    {/* <Navbar /> */}
                    <main className="flex-1 w-full">
                        {children}
                    </main>
                </HomeNotificationProvider>
            </NotificationProvider>
        </div>
    );
};

export default DashboardLayout;