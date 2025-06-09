"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
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
import { Menu } from "lucide-react";

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const logAuthState = () => {
        const token = localStorage.getItem("authToken");
        console.log("Auth token:", token);
        console.log("isLoggedIn state:", isLoggedIn);
    };

    useEffect(() => {
        const checkAuthToken = () => {
            const token = localStorage.getItem("authToken");
            console.log("Checking auth token:", token);
            setIsLoggedIn(!!token);
        };

        checkAuthToken();

        // @ts-ignore
        const handleStorageChange = (e) => {
            console.log("Storage change detected:", e);
            if (e.key === "authToken") {
                checkAuthToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const intervalId = setInterval(checkAuthToken, 1000);

        window.addEventListener('authChange', checkAuthToken);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', checkAuthToken);
        };
    }, []);

    useEffect(() => {
        logAuthState();
    });

    const handleLogout = async () => {
        console.log("Logout initiated");
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No token found for logout");
            router.push("/auth");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });

            if (response.ok) {
                console.log("Logout successful, removing token");
                localStorage.removeItem("authToken");
                setIsLoggedIn(false);
                window.dispatchEvent(new Event('authChange'));
                router.push("/");
            } else {
                console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleLoginButtonClick = () => {
        const token = localStorage.getItem('token'); // Check directly
        if (token) {
            handleLogout();
        } else {
            router.push('/auth');
        }
    };

    const NavItems = () => (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">Home</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/dashboard/user-home">User</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/dashboard/instructor-home">Instructor</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">Courses</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/courses">Courses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/contents">Contents</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reviews">Reviews</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/certificates">Certificates</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10">
                <Link href="/forum">Forum</Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">Reporting</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/reporting/courses">Courses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/contents">Contents</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/attendees">Attendees</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/reviews">Reviews</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/quizzes">Quizzes</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/forum">Forum</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reporting/certifications">Certifications</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-primary/10">Configuration</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/configuration/settings">Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/configuration/course-groups">Course Groups</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/configuration/content-tags">Content Tags</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10">
                <Link href="/dashboard/profile">Profile</Link>
            </Button>

            <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10">
                <Link href="/pricing">Pricing</Link>
            </Button>
        </>
    );

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-40 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center">
                        <span className="text-white text-2xl font-bold">eLearning</span>
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
                        <SheetContent side="right" className="flex flex-col gap-4 pt-10">
                            <NavItems />
                        </SheetContent>
                    </Sheet>
                </div>
                
                <div>
                    <Button
                        variant={isLoggedIn ? "destructive" : "default"}
                        onClick={handleLoginButtonClick}
                    >
                        {isLoggedIn ? "LOGOUT" : "LOGIN"}
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;