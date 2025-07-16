'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const routeIgnore = ['/dashboard', '/pricing'];

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();

  // Hide navbar if the pathname starts with one of the prefixes
  const shouldHideNavbar = routeIgnore.some(prefix =>
    pathname?.startsWith(prefix)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
};

export default NavbarWrapper;