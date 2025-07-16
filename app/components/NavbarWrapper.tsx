'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

// Routes that should NOT show the navbar
const routeIgnore = ['/dashboard', '/pricing', '/contact-us', '/courses', '/auth'];

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname() ?? '';

  // remove trailing slash, keep leading slash
  const cleanPath = pathname.replace(/\/$/, '');

  const shouldHide = routeIgnore.some(
    prefix => cleanPath === prefix || cleanPath.startsWith(prefix + '/')
  );

  if (shouldHide) return null;

  return <Navbar />;
};

export default NavbarWrapper;