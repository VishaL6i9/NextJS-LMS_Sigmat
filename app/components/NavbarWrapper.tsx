'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();
  
  // Don't render the navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Navbar />;
};

export default NavbarWrapper;