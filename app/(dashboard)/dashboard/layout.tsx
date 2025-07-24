const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;