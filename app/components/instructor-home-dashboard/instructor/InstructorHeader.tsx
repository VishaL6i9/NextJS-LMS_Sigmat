'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, BookOpen, LogOut, Menu, Plus, Search, Settings, User, Target, Users, BarChart3 } from 'lucide-react';
import { useInstructor } from '../contexts/InstructorContext';
import { useUser } from '@/app/contexts/UserContext';
import { getProfileImageId, getProfileImage, ApiError, getUserId, getUserRoles, Role } from "@/app/components/services/api";

interface InstructorHeaderProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const InstructorHeader: React.FC<InstructorHeaderProps> = ({
    activeTab = 'overview',
    onTabChange
}) => {
    const { state } = useInstructor();
    const { userProfile, setUserProfile } = useUser();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const imageUrlToRevoke = useRef<string | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const profileRef = useRef<HTMLDivElement>(null);

    const fadeInUp = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const handleTabClick = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        setUserProfile(null);
        router.push("/");
    };

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

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[2000px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
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

                        {/* Professional Navigation Pills */}
                        <div className="hidden lg:flex ml-8">
                            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-lg rounded-full p-1">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleTabClick('overview')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'overview'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                            }`}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        <span>Overview</span>
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('management')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'management'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                            }`}
                                    >
                                        <Target className="w-4 h-4" />
                                        <span>Management</span>
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('students')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'students'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                            }`}
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>Students</span>
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('analytics')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'analytics'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                            : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                            }`}
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Analytics</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    {/* Search and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Professional Search Bar */}
                        <div className="hidden md:flex relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses, students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-72 pl-11 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-full text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                            />
                        </div>

                        {/* Professional Action Button */}
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:block">New Course</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button className="lg:hidden p-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-300">
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Professional Notifications */}
                        <button className="relative p-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-300 group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg group-hover:scale-110 transition-transform duration-200">
                                {state.stats.pendingGrades}
                            </span>
                        </button>

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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default InstructorHeader;