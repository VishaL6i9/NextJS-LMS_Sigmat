// app/layout.tsx
import React from 'react';
import './globals.css';
import Navbar from "@/app/components/Navbar"; 

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <html lang="en">
      <body>
      <Navbar />
      <main className="p-4">
        {children}
      </main>
      </body>
      </html>
  );
};

export default RootLayout;