'use client';

import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Menu, LogOut, User, Bell, Settings, Crown} from "lucide-react";
import { useUser } from '@/app/contexts/UserContext';
import { useNotifications } from './contexts/NotificationContext';
import NotificationCenter from './NotificationCenter';
import {getUserRoles} from "@/app/components/services/api";
import {ChevronDown} from "@/components/ui/ChevronDown";

const MergedNavbar: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const { state } = useNotifications();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    useEffect(() => {
        // Fetch user roles when userProfile changes
        const fetchUserRoles = async () => {
            if (userProfile) {
                try {
                    const roles = await getUserRoles();
                    const roleNames = roles.map(role => role.name || role.toString());
                    setUserRoles(roleNames);
                } catch (error) {
                    console.error('Failed to fetch user roles:', error);
                    setUserRoles([]);
                }
            }
        };

        fetchUserRoles();
    }, [userProfile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        console.log("Logout initiated");
        // In a real application, you would call your backend logout endpoint here
        localStorage.removeItem("token");
        setUserProfile(null);
        router.push("/");
    };

    const handleLoginButtonClick = () => {
        router.push('/auth');
    };

    const NavItems = () => (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Home <ChevronDown width={16} height={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    {(userRoles.includes('USER') || userRoles.includes('SUPER_ADMIN')) && (
                        <DropdownMenuItem asChild><Link href="/user/home"
                                                        className="w-full">User</Link></DropdownMenuItem>
                    )}
                    {(userRoles.includes('INSTRUCTOR') || userRoles.includes('SUPER_ADMIN')) && (
                        <DropdownMenuItem asChild><Link href="/instructor/home"
                                                        className="w-full">Instructor</Link></DropdownMenuItem>
                    )}
                    {(userRoles.includes('INSTITUTION') || userRoles.includes('ADMIN')) || userRoles.includes('SUPER_ADMIN') && (
                        <DropdownMenuItem asChild><Link href="/institution/dashboard" className="w-full">Institution</Link></DropdownMenuItem>
                    )}
                    {userRoles.includes('SUPER_ADMIN') && (
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/super-admin-home" className="w-full flex items-center">
                                <Crown className="mr-2 h-4 w-4 text-purple-600" />
                                Super Admin
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">Courses</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto">
                    <DropdownMenuItem asChild><Link href="/courses" className="w-full">Courses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/contents"
                                                    className="w-full">Contents</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reviews" className="w-full">Reviews</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/certificates"
                                                    className="w-full">Certificates</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild
                    className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/forum">Forum</Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">Reporting</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto">
                    <DropdownMenuItem asChild><Link href="/reporting/courses"
                                                    className="w-full">Courses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/contents"
                                                    className="w-full">Contents</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/attendees"
                                                    className="w-full">Attendees</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/reviews"
                                                    className="w-full">Reviews</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/quizzes"
                                                    className="w-full">Quizzes</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/forum"
                                                    className="w-full">Forum</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/certifications"
                                                    className="w-full">Certifications</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">Configuration</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto">
                    <DropdownMenuItem asChild><Link href="/configuration/settings"
                                                    className="w-full">Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/configuration/course-groups" className="w-full">Course
                        Groups</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/configuration/content-tags" className="w-full">Content
                        Tags</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild
                    className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/dashboard/profile">Profile</Link>
            </Button>

            <Button variant="ghost" asChild
                    className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/pricing">Pricing</Link>
            </Button>

            {/* Notification-specific nav item */}
            <Button variant="ghost" asChild
                    className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/user/notification">Notifications</Link>
            </Button>
            
        </>
    );

    return (
        <div>
            {/* Main Navbar */}
            <nav
                className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-40 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/sigmat_logo.jpg"
                                alt="SIGMAT Logo"
                                className="h-8 w-auto"
                            />
                            <span className="text-white text-xl md:text-2xl font-bold">eLearning</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavItems />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right"
                                className="w-[85vw] max-w-md flex flex-col gap-4 pt-10 overflow-y-auto">
                                <NavItems />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Enhanced Notification Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative p-2 rounded-full text-white hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                            >
                                <Bell className="w-5 h-5" />
                                {state.stats.unread > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                                        {state.stats.unread > 9 ? '9+' : state.stats.unread}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                    <NotificationCenter onClose={() => setIsNotificationOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        {userProfile ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-primary/10 transition-colors duration-200"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={userProfile.profileImage || "/placeholder-avatar.jpg"} alt="User Avatar" />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                            {userProfile.firstName && userProfile.firstName[0]}
                                            {userProfile.lastName && userProfile.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm font-medium text-white">
                                        {userProfile.firstName} {userProfile.lastName}
                                    </span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {userProfile.firstName} {userProfile.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{userProfile.email}</p>
                                        </div>
                                        <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <User className="w-4 h-4 mr-3" />
                                            Profile
                                        </Link>
                                        <Link href="/configuration/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </Link>
                                        <hr className="my-1" />
                                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                variant="default"
                                onClick={handleLoginButtonClick}
                                className="text-sm md:text-base"
                            >
                                LOGIN
                            </Button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default MergedNavbar;