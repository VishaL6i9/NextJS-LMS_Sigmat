// app/(dashboard)/layout.tsx
import React from 'react';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 w-full">
      {children}
    </main>
  );
};

export default DashboardLayout;