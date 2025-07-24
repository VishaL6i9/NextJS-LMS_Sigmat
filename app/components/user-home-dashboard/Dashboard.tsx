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
    ChevronLeft
} from 'lucide-react';
import { Calendar1 as Calendar } from '@/components/ui/Calendar1';
import { useNotifications } from '@/app/components/user-notification-dashboard/contexts/NotificationContext';
import { NotificationCenter } from '@/app/components/user-home-dashboard/NotificationCenter';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Full-width header section */}
            <div className="w-full py-12 px-6 lg:px-12 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="max-w-[2000px] mx-auto">
                    <motion.div className="mb-12" variants={fadeInUp} initial="initial" animate="animate">
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Welcome, {userProfile?.firstName || 'Student'}!
                        </h1>
                        <p className="text-xl text-gray-600">Here's your learning snapshot for today.</p>
                    </motion.div>
                </div>
            </div>

            {/* Content with padding */}
            <div className="w-full max-w-[2000px] mx-auto px-6 lg:px-12 py-8">
                {/* Stats Grid */}
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" variants={staggerContainer} initial="initial" animate="animate">
                    {stats.map((stat) => (
                        <motion.div key={stat.name} variants={fadeInUp}>
                            <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <motion.div className="lg:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
                        <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
                                <CardDescription>What's new in your courses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => {
                                        const Icon = activity.icon;
                                        return (
                                            <motion.div key={activity.id} whileHover={{ scale: 1.02 }} className="flex items-center space-x-4 p-3 -m-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                                                <div className="flex-shrink-0">
                                                    <Icon className={`h-6 w-6 ${activity.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-gray-400" />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                <Button variant="outline" onClick={() => setActiveTab('notifications')} className="mt-6 w-full bg-transparent border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white">
                                    View All Notifications
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div className="space-y-8" variants={fadeInUp} initial="initial" animate="animate">
                        {/* Quick Actions */}
                        <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={() => handleQuickAction('View Assignments')} className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md"><BookOpen className="mr-3 h-5 w-5" /> View Assignments</Button>
                                <Button onClick={() => handleQuickAction('Check Grades')} className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"><BarChart3 className="mr-3 h-5 w-5" /> Check Grades</Button>
                                <Button onClick={() => handleQuickAction('View Schedule')} className="w-full justify-start bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-md"><Calendar width={20} height={20} stroke="white" className="mr-3" /> View Schedule</Button>
                            </CardContent>
                        </Card>

                        {/* Upcoming Deadlines */}
                        <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-900">Upcoming Deadlines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {upcomingDeadlines.map((deadline) => (
                                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                                            <p className="text-xs text-gray-600">{deadline.course}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-800">{deadline.dueDate}</p>
                                            <Badge className={`mt-1 ${deadline.priority === 'high' ? 'bg-red-500' :
                                                deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}>
                                                {deadline.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
