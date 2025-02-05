import React from 'react';
import './globals.css';
import Navbar from "@/app/components/Navbar"; 
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LMS Platform',
  description: 'A comprehensive learning management system',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Navbar />
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
