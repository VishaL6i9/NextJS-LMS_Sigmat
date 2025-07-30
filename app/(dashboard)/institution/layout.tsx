'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building,  
  GraduationCap, 
  BookOpen, 
  Globe, 
  BarChart3, 
  Settings, 
  Crown,
  Menu,
  X,
  Home,
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Zap
} from 'lucide-react';
import { Users } from '@/components/ui/Users';
import { ChevronDown } from '@/components/ui/ChevronDown';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  badge?: string;
}

const InstitutionLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/institution/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      name: 'Students',
      href: '/institution/students',
      icon: Users,
      description: 'Manage your students'
    },
    {
      name: 'Instructors',
      href: '/institution/instructors',
      icon: GraduationCap,
      description: 'Manage teaching staff'
    },
    {
      name: 'Courses',
      href: '/institution/courses',
      icon: BookOpen,
      description: 'Institute courses'
    },
    {
      name: 'Global Marketplace',
      href: '/institution/marketplace',
      icon: Globe,
      description: 'Browse global courses',
      badge: 'New'
    },
    {
      name: 'Analytics',
      href: '/institution/analytics',
      icon: BarChart3,
      description: 'Performance insights'
    },
    {
      name: 'Settings',
      href: '/institution/settings',
      icon: Settings,
      description: 'Institute configuration'
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const NavigationLink = ({ item }: { item: NavigationItem }) => (
    <Link
      href={item.href}
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        isActive(item.href)
          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg'
          : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
      onClick={() => setSidebarOpen(false)}
    >
      <item.icon
        className={`mr-3 h-5 w-5 transition-colors ${
          isActive(item.href) ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
        }`}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span>{item.name}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400 mt-1">{item.description}</div>
      </div>
    </Link>
  );

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-white/20">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-3">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Institution Portal</h1>
            <p className="text-xs text-slate-400">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavigationLink key={item.name} item={item} />
        ))}
      </nav>

      {/* Premium Upgrade Banner */}
      <div className="p-4 m-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
        <div className="flex items-center mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mr-3">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Upgrade to Premium</h3>
            <p className="text-slate-300 text-xs">Unlock advanced features</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-slate-300">AI Analytics</span>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
          <Crown className="w-4 h-4" />
          <span>Upgrade Now</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-slate-900/95 backdrop-blur-lg border-r border-white/20">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="bg-slate-900/50 backdrop-blur-lg border-r border-white/20">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-white" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative">
                <Bell className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-white text-sm font-medium">Admin User</div>
                    <div className="text-slate-400 text-xs">Institution Admin</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/security"
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Shield className="mr-3 h-4 w-4" />
                        Security
                      </Link>
                      <Link
                        href="/institution/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Institute Settings
                      </Link>
                      <div className="border-t border-white/20 my-2"></div>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-white/10 transition-colors">
                        <Crown className="mr-3 h-4 w-4" />
                        Upgrade Premium
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default InstitutionLayout;