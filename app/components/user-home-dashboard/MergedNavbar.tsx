'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
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
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User, Crown } from "lucide-react";
import { ChevronDown } from "@/components/ui/ChevronDown";
import { useUser } from '@/app/contexts/UserContext';
import { NotificationDropdown } from './NotificationDropdown';
import { getUserRoles } from "@/app/components/services/api";

const MergedNavbar: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
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

    const handleLogout = async () => {
        console.log("Logout initiated");
        // In a real application, you would call your backend logout endpoint here
        localStorage.removeItem("token");
        setUserProfile(null);
        router.push("/");
    };

    const handleLoginButtonClick = () => {
        router.push('/auth/login');
    };

    const NavItems = () => (
        <>
            {userProfile ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost"
                            className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                            Home <ChevronDown width={16} height={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        {(userRoles.includes('USER') || userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN')) && (
                            <DropdownMenuItem asChild><Link href="/dashboard/user-home"
                                className="w-full">User</Link></DropdownMenuItem>
                        )}
                        {(userRoles.includes('INSTRUCTOR') || userRoles.includes('ADMIN') || userRoles.includes('SUPER_ADMIN')) && (
                            <DropdownMenuItem asChild><Link href="/dashboard/instructor-home"
                                className="w-full">Instructor</Link></DropdownMenuItem>
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
            ) : (
                <Button variant="ghost" asChild
                    className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                    <Link href="/">Home</Link>
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                        className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Courses <ChevronDown width={16} height={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                        className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Reporting <ChevronDown width={16} height={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                        className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Configuration <ChevronDown width={16} height={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
        </>
    );

    return (
        <div>
            {/* Enhanced Main Navbar */}
            <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-xl shadow-lg">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
                
                <div className="container mx-auto flex h-16 items-center justify-between px-6 relative">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 blur-3xl opacity-30 pointer-events-none"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:bg-white/30 transition-all duration-300 pointer-events-none"></div>
                                <img
                                    src="/sigmat_logo.jpg"
                                    alt="SIGMAT Logo"
                                    className="relative h-10 w-auto rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-blue-100 group-hover:to-white transition-all duration-300">
                                    eLearning
                                </span>
                                <span className="text-blue-200 text-xs font-medium opacity-80">
                                    Learn • Grow • Excel
                                </span>
                            </div>
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
                                className="w-[85vw] max-w-md flex flex-col gap-4 pt-10 overflow-y-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                </SheetHeader>
                                <NavItems />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center space-x-6 relative z-10">
                        {/* Enhanced Notification Dropdown */}
                        <div className="text-white relative">
                            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40">
                                <NotificationDropdown />
                            </div>
                        </div>

                        {/* Enhanced User Profile */}
                        {userProfile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 hover:scale-105 transition-all duration-300 group">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-blue-200/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        
                                        <Avatar className="relative h-12 w-12 border-2 border-white/30 group-hover:border-white/60 transition-all duration-300 shadow-lg">
                                            <AvatarImage src={userProfile.profileImage || "/placeholder-avatar.jpg"} alt="User Avatar" />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 text-white font-bold text-lg">
                                                {userProfile.firstName && userProfile.firstName[0]}
                                                {userProfile.lastName && userProfile.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        
                                        {/* Online indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-2" align="end" forceMount>
                                    {/* User info header */}
                                    <div className="px-4 py-3 border-b border-gray-200/50 mb-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {userProfile.firstName} {userProfile.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600">Welcome back!</p>
                                    </div>
                                    
                                    <DropdownMenuItem className="rounded-xl hover:bg-blue-50 transition-colors duration-200">
                                        <Link href="/dashboard/profile" className="flex items-center w-full">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium">Profile Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl hover:bg-purple-50 transition-colors duration-200">
                                        <Link href="/dashboard/subscription" className="flex items-center w-full">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                                <Crown className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <span className="font-medium">Billing & Subscription</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={handleLogout}
                                        className="rounded-xl hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-700"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                                            <LogOut className="h-4 w-4 text-red-600" />
                                        </div>
                                        <span className="font-medium">Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-blue-200/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                <Button
                                    onClick={handleLoginButtonClick}
                                    className="relative text-sm md:text-base bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold px-6 py-2 rounded-2xl border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    LOGIN
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default MergedNavbar;