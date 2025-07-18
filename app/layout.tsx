// app/layout.tsx
import React from 'react';
import './globals.css';
import { UserProvider } from './contexts/UserContext';
import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster";
import ContactUsToast from '@/app/components/ContactUsToast';


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
      <ContactUsToast />
      <Toaster />
      </body>
      </html>
  );
};

export default RootLayout;