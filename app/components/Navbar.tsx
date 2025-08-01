"use client";
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
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
import { Menu, LogOut, User, Crown } from "lucide-react";
import { ChevronDown } from "@/components/ui/ChevronDown";
import { useUser } from '@/app/contexts/UserContext';
import { getProfileImageId, getProfileImage, ApiError, getUserId, getUserRoles, Role } from "@/app/components/services/api";

const Navbar: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const imageUrlToRevoke = useRef<string | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const roles = await getUserRoles();
                const roleNames = roles.map(role => role.name || role.toString());
                setUserRoles(roleNames);
            } catch (error) {
                console.error('Failed to fetch user roles:', error);
            }
        };

        const fetchAvatar = async () => {
            if (userProfile && userProfile.id) {
                try {
                    const userID = await getUserId();
                    const profileImageID = await getProfileImageId(userID);

                    // Check if profileImageID is valid before trying to fetch the image
                    if (profileImageID && profileImageID.trim() !== '') {
                        const imageBlob = await getProfileImage(profileImageID);

                        if (imageUrlToRevoke.current) {
                            URL.revokeObjectURL(imageUrlToRevoke.current);
                        }
                        const url = URL.createObjectURL(imageBlob);
                        setAvatarUrl(url);
                        imageUrlToRevoke.current = url;
                    } else {
                        // No valid profile image ID, use fallback
                        console.log("No profile image ID found, using fallback with initials:",
                            userProfile.firstName?.[0], userProfile.lastName?.[0]);
                        setAvatarUrl(null);
                    }
                } catch (error) {
                    console.log("Profile image fetch failed, using fallback with initials:",
                        userProfile.firstName?.[0], userProfile.lastName?.[0], error);
                    // Clean up any existing URL
                    if (imageUrlToRevoke.current) {
                        URL.revokeObjectURL(imageUrlToRevoke.current);
                        imageUrlToRevoke.current = null;
                    }
                    setAvatarUrl(null); // This will trigger the fallback with first letters
                }
            } else {
                if (imageUrlToRevoke.current) {
                    URL.revokeObjectURL(imageUrlToRevoke.current);
                    imageUrlToRevoke.current = null;
                }
                setAvatarUrl(null);
            }
        };

        fetchUserRoles();
        fetchAvatar();

        return () => {
            if (imageUrlToRevoke.current) {
                URL.revokeObjectURL(imageUrlToRevoke.current);
                imageUrlToRevoke.current = null;
            }
        };
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
            {userProfile ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                            Home <ChevronDown width={16} height={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        {(userRoles.includes('USER') || userRoles.includes('SUPER_ADMIN'))&& (
                            <DropdownMenuItem asChild><Link href="/user/home" className="w-full">User</Link></DropdownMenuItem>
                        )}
                        {(userRoles.includes('INSTRUCTOR') || userRoles.includes('SUPER_ADMIN')) && (
                            <DropdownMenuItem asChild><Link href="/instructor/home" className="w-full">Instructor</Link></DropdownMenuItem>
                        )}
                        {(userRoles.includes('INSTITUTION') || userRoles.includes('ADMIN')) || userRoles.includes('SUPER_ADMIN') && (
                            <DropdownMenuItem asChild><Link href="/institution/dashboard" className="w-full">Institution</Link></DropdownMenuItem>
                        )}
                        {(userRoles.includes('SUPER_ADMIN') &&
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
                <Button variant="ghost" asChild className="text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                    <Link href="/">Home</Link>
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-primary hover:bg-primary/10 w-full justify-start md:w-auto">
                        Courses <ChevronDown width={16} height={16} />
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
                    {userProfile && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="ghost" className="relative h-11 w-11 rounded-full">
                                        <Avatar className="h-11 w-11 border-2 border-white/50">
                                            {/* Only use the image if avatarUrl is available, otherwise trigger the fallback */}
                                            {avatarUrl ? (
                                                <AvatarImage src={avatarUrl} alt="User Avatar" />
                                            ) : (
                                                <AvatarImage src="" alt="User Avatar" onError={(e) => {
                                                    console.log("Avatar image failed to load, using initials fallback");
                                                    e.currentTarget.style.display = 'none';
                                                }} />
                                            )}
                                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-600 text-white">
                                                {userProfile ? `${userProfile.firstName?.[0] ?? ''}${userProfile.lastName?.[0] ?? ''}` : 'U'}
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
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/subscription" className="flex items-center w-full cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Billings & Subscriptions</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {!userProfile && (
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
                                    <Menu className="h-7 w-7" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] max-w-md flex flex-col gap-4 pt-10 overflow-y-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <NavItems isMobile />
                                {userProfile ? (
                                    <>
                                        <Link href="/dashboard/profile" className="flex items-center w-full cursor-pointer text-gray-700 hover:text-primary py-2 px-4 rounded-md transition-colors duration-200">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </Button>
                                    </>
                                ) : (
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
