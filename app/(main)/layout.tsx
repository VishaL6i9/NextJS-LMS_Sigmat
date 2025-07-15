// app/(main)/layout.tsx
import React from 'react';
import Navbar from "@/app/components/Navbar"; 

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
    </>
  );
};

export default MainLayout;