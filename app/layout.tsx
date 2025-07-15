// app/layout.tsx
import React from 'react';
import './globals.css';
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
          {children}
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;