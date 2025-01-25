// app/layout.tsx
import React from 'react';
 // Adjust the path if necessary
import './globals.css';
import Navbar from "@/app/components/Navbar"; // Import global styles (including Tailwind CSS)

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