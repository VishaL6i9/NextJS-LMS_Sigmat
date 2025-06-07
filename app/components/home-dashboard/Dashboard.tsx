'use client'; // Required for client-side interactivity in Next.js 13+

import { useState } from 'react';
import {
    Bell,
    BookOpen,
    Calendar,
    GraduationCap,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    Award,
    Target,
    BarChart3
} from 'lucide-react';
import { useNotifications } from '@/app/components/contexts/NotificationContext';
import { NotificationCenter } from '@/app/components/home-dashboard/NotificationCenter';

export const Dashboard = () => {
    const { notifications, unreadCount, showToast } = useNotifications();
    const [activeTab, setActiveTab] = useState<'overview' | 'notifications'>('overview');

    // Calculate dashboard metrics
    const totalNotifications = notifications.length;
    const recentAssignments = notifications.filter(n => n.category === 'assignment').length;
    const recentGrades = notifications.filter(n => n.category === 'grade').length;
    const systemAlerts = notifications.filter(n => n.category === 'system' && !n.isRead).length;

    const handleQuickAction = (action: string) => {
        showToast({
            title: 'Action Completed',
            message: `${action} action has been triggered.`,
            type: 'success',
        });
    };

    const stats = [
        {
            name: 'Unread Notifications',
            value: unreadCount,
            icon: Bell,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            change: '+12%',
            changeType: 'increase'
        },
        {
            name: 'Active Courses',
            value: 6,
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+2%',
            changeType: 'increase'
        },
        {
            name: 'Pending Assignments',
            value: recentAssignments,
            icon: Target,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: '-8%',
            changeType: 'decrease'
        },
        {
            name: 'Average Grade',
            value: '92%',
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '+5%',
            changeType: 'increase'
        }
    ];

    const recentActivity = [
        {
            id: '1',
            type: 'assignment',
            title: 'Chemistry Lab Report submitted',
            description: 'Your assignment has been received and is under review.',
            time: '2 hours ago',
            icon: CheckCircle,
            iconColor: 'text-green-500'
        },
        {
            id: '2',
            type: 'grade',
            title: 'Mathematics Quiz graded',
            description: 'You scored 95/100 on your recent quiz.',
            time: '4 hours ago',
            icon: Award,
            iconColor: 'text-blue-500'
        },
        {
            id: '3',
            type: 'announcement',
            title: 'New discussion forum opened',
            description: 'Join the Physics study group discussion.',
            time: '6 hours ago',
            icon: Users,
            iconColor: 'text-purple-500'
        },
        {
            id: '4',
            type: 'reminder',
            title: 'Assignment due tomorrow',
            description: 'Don\'t forget about your English essay.',
            time: '8 hours ago',
            icon: AlertTriangle,
            iconColor: 'text-orange-500'
        }
    ];

    const upcomingDeadlines = [
        {
            id: '1',
            title: 'English Essay',
            course: 'ENG 101',
            dueDate: 'Tomorrow',
            priority: 'high'
        },
        {
            id: '2',
            title: 'Math Problem Set',
            course: 'MATH 201',
            dueDate: 'Friday',
            priority: 'medium'
        },
        {
            id: '3',
            title: 'Physics Lab Report',
            course: 'PHY 301',
            dueDate: 'Next Monday',
            priority: 'low'
        }
    ];

    if (activeTab === 'notifications') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <span>← Back to Dashboard</span>
                        </button>
                    </div>
                    <NotificationCenter />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your courses.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                                    <span className="text-sm text-gray-500 ml-2">from last week</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                                    <button
                                        onClick={() => setActiveTab('notifications')}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentActivity.map((activity) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleQuickAction('View Assignments')}
                                    className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                                >
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">View Assignments</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction('Check Grades')}
                                    className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                                >
                                    <BarChart3 className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-900">Check Grades</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction('View Schedule')}
                                    className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                                >
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-900">View Schedule</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className="w-full flex items-center space-x-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                                >
                                    <Bell className="h-5 w-5 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-900">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="ml-auto bg-orange-600 text-white text-xs rounded-full px-2 py-1">
                      {unreadCount}
                    </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                            <div className="space-y-3">
                                {upcomingDeadlines.map((deadline) => (
                                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                                            <p className="text-xs text-gray-600">{deadline.course}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600">{deadline.dueDate}</p>
                                            <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
                                                deadline.priority === 'high' ? 'bg-red-500' :
                                                    deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">LMS Status</span>
                                    <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Server Load</span>
                                    <span className="text-sm text-gray-900">12%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">System Alerts</span>
                                    <span className="text-sm text-gray-900">{systemAlerts}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};