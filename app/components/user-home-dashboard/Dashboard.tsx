'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Bell,
    BookOpen,
    Award,
    Target,
    ArrowRight,
    CheckCircle,
    Users,
    AlertTriangle,
    BarChart3,
    ChevronLeft,
    Activity,
    Zap
} from 'lucide-react';
import { Calendar1 as Calendar } from '@/components/ui/Calendar1';
import { useNotifications } from '@/app/components/user-notification-dashboard/contexts/NotificationContext';
import { NotificationCenter } from '@/app/components/user-home-dashboard/NotificationCenter';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from 'next/dynamic';
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false });
import { useUser } from '@/app/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { getUserId, getUserEnrollments } from '@/app/components/services/api';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const Dashboard = () => {
    const router = useRouter();
    const { userProfile } = useUser();
    const { state } = useNotifications();
    const [activeTab, setActiveTab] = useState<'overview' | 'notifications'>('overview');
    const [activeCourses, setActiveCourses] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Move token check to useEffect to avoid rendering issues
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            toast({
                title: "Invalid Session",
                description: "Please Login Before Proceeding.",
                variant: "default",
            });
        }
    }, [router]);

    // Fetch user enrollments to get active courses count
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                setIsLoading(true);
                const userId = await getUserId();
                const enrollments = await getUserEnrollments(userId);
                setActiveCourses(enrollments.length);
            } catch (error) {
                console.error("Failed to fetch enrollments:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch your active courses.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (userProfile) {
            fetchEnrollments();
        }
    }, [userProfile]);

    const recentAssignments = state.notifications.filter(n => n.category === 'ASSIGNMENT').length;

    const handleQuickAction = (action: string) => {
        toast({
            title: 'Action Completed',
            description: `${action} action has been triggered.`,
            variant: 'default',
        });
    };

    const stats = [
        { name: 'Unread Notifications', value: state.stats.unread, icon: Bell, color: 'from-red-500 to-orange-500' },
        { name: 'Active Courses', value: isLoading ? '...' : activeCourses, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
        { name: 'Pending Assignments', value: recentAssignments, icon: Target, color: 'from-yellow-500 to-amber-500' },
        { name: 'Average Grade', value: '92%', icon: Award, color: 'from-green-500 to-emerald-500' }
    ];

    const recentActivity = [
        { id: '1', type: 'assignment', title: 'Chemistry Lab Report submitted', time: '2 hours ago', icon: CheckCircle, iconColor: 'text-green-500' },
        { id: '2', type: 'grade', title: 'Mathematics Quiz graded: 95/100', time: '4 hours ago', icon: Award, iconColor: 'text-blue-500' },
        { id: '3', type: 'announcement', title: 'New discussion forum opened', time: '6 hours ago', icon: Users, iconColor: 'text-purple-500' },
        { id: '4', type: 'reminder', title: 'Assignment due tomorrow', time: '8 hours ago', icon: AlertTriangle, iconColor: 'text-orange-500' }
    ];

    const upcomingDeadlines = [
        { id: '1', title: 'English Essay', course: 'ENG 101', dueDate: 'Tomorrow', priority: 'high' },
        { id: '2', title: 'Math Problem Set', course: 'MATH 201', dueDate: 'Friday', priority: 'medium' },
        { id: '3', title: 'Physics Lab Report', course: 'PHY 301', dueDate: 'Next Monday', priority: 'low' }
    ];

    if (activeTab === 'notifications') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Full-width header section */}
                <div className="w-full py-8 px-6 lg:px-12 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="max-w-[2000px] mx-auto">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                            <Button onClick={() => setActiveTab('overview')} variant="ghost" className="mb-8 text-indigo-600 hover:text-indigo-800">
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Back to Dashboard
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Content with padding */}
                <div className="w-full max-w-[2000px] mx-auto px-6 lg:px-12 py-8">
                    <NotificationCenter />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
            </div>

            {/* Full-width header section */}
            <div className="relative w-full py-16 px-6 lg:px-12 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-b border-white/20">
                <div className="max-w-[2000px] mx-auto">
                    <motion.div className="mb-12" variants={fadeInUp} initial="initial" animate="animate">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-12 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-4"></div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                    Welcome back, {userProfile?.firstName || 'Student'}!
                                </h1>
                                <p className="text-xl text-gray-600 font-medium">Ready to continue your learning journey? ✨</p>
                            </div>
                        </div>
                        
                        {/* Quick stats bar */}
                        <div className="flex flex-wrap gap-6 mt-8">
                            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Learning streak: {Math.floor(Math.random() * 15) + 1} days</span>
                            </div>
                            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">{activeCourses} active courses</span>
                            </div>
                            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">{state.stats.unread} new notifications</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content with padding */}
            <div className="relative w-full max-w-[2000px] mx-auto px-6 lg:px-12 py-8">
                {/* Enhanced Stats Grid */}
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" variants={staggerContainer} initial="initial" animate="animate">
                    {stats.map((stat, index) => (
                        <motion.div key={stat.name} variants={fadeInUp} whileHover={{ scale: 1.05, y: -8 }}>
                            <div className="group relative h-full">
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                                
                                {/* Main card */}
                                <Card className="relative h-full border-0 shadow-xl bg-white/70 backdrop-blur-xl overflow-hidden rounded-3xl group-hover:shadow-2xl transition-all duration-500">
                                    {/* Animated background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-transparent"></div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                    </div>
                                    
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                                        <div>
                                            <CardTitle className="text-sm font-semibold text-gray-600 mb-1">{stat.name}</CardTitle>
                                            <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                                                {stat.value}
                                            </div>
                                        </div>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <stat.icon className="h-7 w-7 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        {/* Progress indicator */}
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                            <div 
                                                className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                                                style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString())) * 2)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {index === 0 && '+2 this month'}
                                            {index === 1 && '+1 this week'}
                                            {index === 2 && 'Great progress!'}
                                            {index === 3 && 'Keep it up!'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity - Enhanced */}
                    <motion.div className="lg:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
                        <div className="group relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <Card className="relative border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                {/* Animated background */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-400/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                                </div>
                                
                                <CardHeader className="relative z-10 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
                                                <CardDescription className="text-gray-600 font-medium">What's happening in your learning journey</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-blue-600 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
                                            <span>View All</span>
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => {
                                            const Icon = activity.icon;
                                            return (
                                                <motion.div 
                                                    key={activity.id} 
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.02, x: 8 }} 
                                                    className="group/item flex items-center space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/50"
                                                >
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        activity.type === 'assignment' ? 'bg-green-100' :
                                                        activity.type === 'grade' ? 'bg-blue-100' :
                                                        activity.type === 'announcement' ? 'bg-purple-100' : 'bg-orange-100'
                                                    } group-hover/item:scale-110 transition-transform duration-300`}>
                                                        <Icon className={`h-6 w-6 ${activity.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 group-hover/item:text-gray-800">{activity.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1 font-medium">{activity.time}</p>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover/item:text-blue-500 group-hover/item:translate-x-1 transition-all duration-300" />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={() => setActiveTab('notifications')} 
                                            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <Bell className="w-4 h-4 mr-2" />
                                            View All Notifications
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Enhanced Sidebar */}
                    <motion.div className="space-y-8" variants={fadeInUp} initial="initial" animate="animate">
                        {/* Quick Actions - Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <Card className="relative border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-transparent rounded-full -translate-y-16 -translate-x-16"></div>
                                </div>
                                
                                <CardHeader className="relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={() => handleQuickAction('View Assignments')} 
                                            className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                                        >
                                            <BookOpen className="mr-3 h-5 w-5" /> View Assignments
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={() => handleQuickAction('Check Grades')} 
                                            className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                                        >
                                            <BarChart3 className="mr-3 h-5 w-5" /> Check Grades
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={() => handleQuickAction('View Schedule')} 
                                            className="w-full justify-start bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3 font-semibold"
                                        >
                                            <Calendar className="mr-3 h-5 w-5" /> View Schedule
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Upcoming Deadlines - Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <Card className="relative border-0 shadow-xl bg-white/70 backdrop-blur-xl rounded-3xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-full translate-y-16 translate-x-16"></div>
                                </div>
                                
                                <CardHeader className="relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                            <Target className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900">Upcoming Deadlines</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    {upcomingDeadlines.map((deadline, index) => (
                                        <motion.div 
                                            key={deadline.id} 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            className="group/deadline flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl hover:from-orange-50/80 hover:to-red-50/80 transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-orange-200/50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    deadline.priority === 'high' ? 'bg-red-500' :
                                                    deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                } group-hover/deadline:scale-125 transition-transform duration-300`}></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 group-hover/deadline:text-gray-800">{deadline.title}</p>
                                                    <p className="text-xs text-gray-600 font-medium">{deadline.course}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-800">{deadline.dueDate}</p>
                                                <Badge className={`mt-1 text-xs font-semibold ${
                                                    deadline.priority === 'high' ? 'bg-red-500 hover:bg-red-600' :
                                                    deadline.priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                                } transition-colors duration-300`}>
                                                    {deadline.priority}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
