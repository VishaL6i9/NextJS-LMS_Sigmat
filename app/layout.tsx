// app/layout.tsx
import React from 'react';
import './globals.css';
import Navbar from "@/app/components/Navbar"; 
import { UserProvider } from './contexts/UserContext';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Sigmat LMS',
  description: 'Learning Management System',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;