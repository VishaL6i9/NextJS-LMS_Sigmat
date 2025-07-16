"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useUser } from '@/app/contexts/UserContext';

const Navbar: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
        // User profile changes are handled by the UserContext
    }, [userProfile]);

    const handleLogout = async () => {
        localStorage.removeItem("token");
        setUserProfile(null);
        router.push("/");
    };

    const handleLoginButtonClick = () => {
        router.push('/auth/login');
    };

    const fadeInUp = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Home <ChevronDown size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <DropdownMenuItem asChild><Link href="/dashboard/user-home" className="w-full">User</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/dashboard/instructor-home" className="w-full">Instructor</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Courses <ChevronDown size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <DropdownMenuItem asChild><Link href="/courses" className="w-full">All Courses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/certificates" className="w-full">My Certificates</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/pricing">Pricing</Link>
            </Button>

            <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                <Link href="/contact-us">Contact</Link>
            </Button>
        </>
    );

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <motion.div {...fadeInUp}>
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/sigmat_logo.jpg"
                            alt="SIGMAT Logo"
                            className="h-10 w-auto rounded-md"
                        />
                        <span className="text-white text-2xl md:text-3xl font-bold">eLearning</span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    <NavItems />
                </div>

                <div className="flex items-center gap-4">
                    {userProfile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="ghost" className="relative h-11 w-11 rounded-full">
                                        <Avatar className="h-11 w-11 border-2 border-white/50">
                                            <AvatarImage src={ "/250.jpg"} alt="User Avatar" />
                                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-600 text-white">
                                                {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-2" align="end" forceMount>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="flex items-center w-full cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                            <Button
                                onClick={handleLoginButtonClick}
                                className="px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                            >
                                LOGIN
                            </Button>
                        </motion.div>
                    )}

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <Menu className="h-7 w-7"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] max-w-md flex flex-col gap-4 pt-10 overflow-y-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <NavItems isMobile />
                                {!userProfile && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                                        <Button
                                            onClick={() => {
                                                handleLoginButtonClick();
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                                        >
                                            LOGIN
                                        </Button>
                                    </motion.div>
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
