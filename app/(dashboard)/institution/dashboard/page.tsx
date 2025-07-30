'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    GraduationCap,
    TrendingUp,
    Calendar,
    Award,
    Settings,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Crown,
    Globe,
    Shield,
    Zap,
    Building,
    UserCheck,
    Target,
    DollarSign,
    Clock,
    Star,
    Activity,
    Bell
} from 'lucide-react';
import { ChevronRight } from '@/components/ui/ChevronRight';
import { Users } from '@/components/ui/Users';
import { BookMarked } from '@/components/ui/BookMarked';
import { Download } from '@/components/ui/Download';
import {
    getInstituteByAdminId,
    getInstituteStatistics,
    getInstituteStudents,
    getInstituteInstructors,
    getInstituteCourses,
    getInstituteSubscriptions,
    getUserId,
    InstituteDTO,
    InstituteStatistics,
    UserDTO,
    InstructorDTO,
    CourseDTO,
    InstituteSubscriptionDTO
} from '@/app/components/services/api';

interface DashboardStats {
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    activeSubscriptions: number;
    monthlyGrowth: number;
    completionRate: number;
}

const InstitutionDashboard = () => {
    const [institute, setInstitute] = useState<InstituteDTO | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        activeSubscriptions: 0,
        monthlyGrowth: 0,
        completionRate: 0
    });
    const [students, setStudents] = useState<UserDTO[]>([]);
    const [instructors, setInstructors] = useState<InstructorDTO[]>([]);
    const [courses, setCourses] = useState<CourseDTO[]>([]);
    const [subscriptions, setSubscriptions] = useState<InstituteSubscriptionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const userId = await getUserId();
            const instituteData = await getInstituteByAdminId(parseInt(userId));
            setInstitute(instituteData);

            // Load all data in parallel
            const [
                statisticsData,
                studentsData,
                instructorsData,
                coursesData,
                subscriptionsData
            ] = await Promise.all([
                getInstituteStatistics(instituteData.instituteId),
                getInstituteStudents(instituteData.instituteId),
                getInstituteInstructors(instituteData.instituteId),
                getInstituteCourses(instituteData.instituteId),
                getInstituteSubscriptions(instituteData.instituteId)
            ]);

            setStats({
                totalStudents: statisticsData.totalStudents,
                totalInstructors: statisticsData.totalInstructors,
                totalCourses: statisticsData.totalCourses,
                activeSubscriptions: subscriptionsData.filter(s => s.isActive).length,
                monthlyGrowth: 12.5, // Mock data
                completionRate: 87.3 // Mock data
            });

            setStudents(studentsData);
            setInstructors(instructorsData);
            setCourses(coursesData);
            setSubscriptions(subscriptionsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({
        title,
        value,
        change,
        icon: Icon,
        color,
        index
    }: {
        title: string;
        value: string | number;
        change?: string;
        icon: any;
        color: string;
        index: number;
    }) => (
        <div
            className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {change && (
                    <div className="flex items-center text-green-400 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {change}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-slate-300 text-sm">{title}</p>
            </div>
        </div>
    );

    const QuickActionCard = ({
        title,
        description,
        icon: Icon,
        color,
        onClick,
        index
    }: {
        title: string;
        description: string;
        icon: any;
        color: string;
        onClick: () => void;
        index: number;
    }) => (
        <div
            className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group animate-fade-in-up`}
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
            onClick={onClick}
        >
            <div className={`p-3 rounded-xl bg-gradient-to-r ${color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-300 text-sm mb-4">{description}</p>
            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                Get Started <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );

    const RecentActivityItem = ({
        title,
        description,
        time,
        type,
        index
    }: {
        title: string;
        description: string;
        time: string;
        type: 'student' | 'instructor' | 'course' | 'subscription';
        index: number;
    }) => {
        const getIcon = () => {
            switch (type) {
                case 'student': return <Users className="w-4 h-4" />;
                case 'instructor': return <GraduationCap className="w-4 h-4" />;
                case 'course': return <BookOpen className="w-4 h-4" />;
                case 'subscription': return <Crown className="w-4 h-4" />;
                default: return <Activity className="w-4 h-4" />;
            }
        };

        const getColor = () => {
            switch (type) {
                case 'student': return 'from-blue-500 to-cyan-500';
                case 'instructor': return 'from-purple-500 to-pink-500';
                case 'course': return 'from-green-500 to-emerald-500';
                case 'subscription': return 'from-yellow-500 to-orange-500';
                default: return 'from-gray-500 to-slate-500';
            }
        };

        return (
            <div
                className={`flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getColor()}`}>
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-slate-400 text-xs mt-1">{description}</p>
                </div>
                <div className="text-slate-400 text-xs">{time}</div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                {institute?.instituteName} Dashboard
                            </h1>
                            <p className="text-slate-300 mt-1">
                                Welcome back! Here's what's happening at your institute.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors relative">
                                <Bell className="w-5 h-5 text-white" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                </span>
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Search className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Filter className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Download className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Settings className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents.toLocaleString()}
                        change="+12.5%"
                        icon={Users}
                        color="from-blue-500 to-cyan-500"
                        index={0}
                    />
                    <StatCard
                        title="Total Instructors"
                        value={stats.totalInstructors.toLocaleString()}
                        change="+8.2%"
                        icon={GraduationCap}
                        color="from-purple-500 to-pink-500"
                        index={1}
                    />
                    <StatCard
                        title="Active Courses"
                        value={stats.totalCourses.toLocaleString()}
                        change="+15.3%"
                        icon={BookOpen}
                        color="from-green-500 to-emerald-500"
                        index={2}
                    />
                    <StatCard
                        title="Subscriptions"
                        value={stats.activeSubscriptions.toLocaleString()}
                        change="+22.1%"
                        icon={Crown}
                        color="from-yellow-500 to-orange-500"
                        index={3}
                    />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickActionCard
                            title="Add Students"
                            description="Enroll new students to your institute"
                            icon={UserCheck}
                            color="from-blue-500 to-cyan-500"
                            onClick={() => {/* Navigate to add students */ }}
                            index={0}
                        />
                        <QuickActionCard
                            title="Manage Instructors"
                            description="Add or manage your teaching staff"
                            icon={GraduationCap}
                            color="from-purple-500 to-pink-500"
                            onClick={() => {/* Navigate to manage instructors */ }}
                            index={1}
                        />
                        <QuickActionCard
                            title="Browse Global Courses"
                            description="Subscribe to global courses for your students"
                            icon={Globe}
                            color="from-green-500 to-emerald-500"
                            onClick={() => {/* Navigate to global courses */ }}
                            index={2}
                        />
                        <QuickActionCard
                            title="View Analytics"
                            description="Detailed insights and performance metrics"
                            icon={TrendingUp}
                            color="from-yellow-500 to-orange-500"
                            onClick={() => {/* Navigate to analytics */ }}
                            index={3}
                        />
                    </div>

                    {/* Additional Quick Actions Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        <QuickActionCard
                            title="Schedule Events"
                            description="Manage institute calendar and events"
                            icon={Calendar}
                            color="from-indigo-500 to-purple-500"
                            onClick={() => {/* Navigate to calendar */ }}
                            index={4}
                        />
                        <QuickActionCard
                            title="Award Certificates"
                            description="Issue certificates to deserving students"
                            icon={Award}
                            color="from-amber-500 to-orange-500"
                            onClick={() => {/* Navigate to certificates */ }}
                            index={5}
                        />
                        <QuickActionCard
                            title="Institute Settings"
                            description="Configure institute preferences"
                            icon={Settings}
                            color="from-slate-500 to-gray-500"
                            onClick={() => {/* Navigate to settings */ }}
                            index={6}
                        />
                        <QuickActionCard
                            title="Security Center"
                            description="Manage security and access controls"
                            icon={Shield}
                            color="from-red-500 to-pink-500"
                            onClick={() => {/* Navigate to security */ }}
                            index={7}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Activity className="w-6 h-6 text-blue-400" />
                                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                        <MoreVertical className="w-4 h-4 text-white" />
                                    </button>
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1">
                                        <span>View All</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <RecentActivityItem
                                    title="New student enrolled"
                                    description="John Doe joined Computer Science program"
                                    time="2 hours ago"
                                    type="student"
                                    index={0}
                                />
                                <RecentActivityItem
                                    title="Course subscription activated"
                                    description="Advanced Machine Learning course is now available"
                                    time="4 hours ago"
                                    type="subscription"
                                    index={1}
                                />
                                <RecentActivityItem
                                    title="New instructor added"
                                    description="Dr. Sarah Wilson joined as Mathematics instructor"
                                    time="1 day ago"
                                    type="instructor"
                                    index={2}
                                />
                                <RecentActivityItem
                                    title="Course completed"
                                    description="Introduction to Programming course finished by 25 students"
                                    time="2 days ago"
                                    type="course"
                                    index={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-6">
                        {/* Completion Rate */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Course Completion Rate</h3>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">87.3%</div>
                                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '87.3%' }}></div>
                                </div>
                                <p className="text-slate-300 text-sm">Above industry average</p>
                            </div>
                        </div>

                        {/* Top Performing Courses */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Top Courses</h3>
                            <div className="space-y-3">
                                {courses.slice(0, 3).map((course, index) => (
                                    <div key={course.courseId} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div>
                                            <p className="text-white font-medium text-sm">{course.courseName}</p>
                                            <p className="text-slate-400 text-xs">{course.studentsEnrolled} students</p>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className="text-white text-sm">{course.rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">This Month</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Plus className="w-4 h-4 text-green-400" />
                                        <span className="text-slate-300">New Enrollments</span>
                                    </div>
                                    <span className="text-white font-semibold">+{Math.floor(stats.totalStudents * 0.1)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BookMarked className="w-4 h-4 text-blue-400" />
                                        <span className="text-slate-300">Course Completions</span>
                                    </div>
                                    <span className="text-white font-semibold">+{Math.floor(stats.totalCourses * 2.3)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-purple-400" />
                                        <span className="text-slate-300">Active Subscriptions</span>
                                    </div>
                                    <span className="text-white font-semibold">{stats.activeSubscriptions}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-yellow-400" />
                                        <span className="text-slate-300">Monthly Revenue</span>
                                    </div>
                                    <span className="text-white font-semibold">₹{(125000).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
};

export default InstitutionDashboard;