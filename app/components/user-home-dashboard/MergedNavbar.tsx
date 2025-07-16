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
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User } from "lucide-react";
import { useUser } from '@/app/contexts/UserContext';
import { NotificationDropdown } from './NotificationDropdown';

const MergedNavbar: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // This effect will run whenever userProfile changes
        // No need for localStorage polling or custom events if UserContext is the source of truth
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost"
                            className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">Home</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full md:w-auto">
                    <DropdownMenuItem asChild><Link href="/dashboard/user-home"
                                                    className="w-full">User</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/dashboard/instructor-home"
                                                    className="w-full">Instructor</Link></DropdownMenuItem>
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
                        {/* Notification Dropdown from Dashboard Header */}
                        <div className="text-white">
                            <NotificationDropdown />
                        </div>

                        {/* User Profile */}
                        {userProfile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={userProfile.profileImage || "/placeholder-avatar.jpg"} alt="User Avatar" />
                                            <AvatarFallback>
                                                {userProfile.firstName && userProfile.firstName[0]}
                                                {userProfile.lastName && userProfile.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuItem>
                                        <Link href="/dashboard/profile" className="flex items-center w-full">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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