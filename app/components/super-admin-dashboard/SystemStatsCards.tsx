'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserCheck,
    Crown,
    GraduationCap,
    Activity,
    TrendingUp,
    Database,
    Clock,
    Shield,
    AlertTriangle
} from 'lucide-react';

interface SystemStats {
    totalUsers: number;
    adminCount: number;
    superAdminCount: number;
    instructorCount: number;
    regularUserCount: number;
    activeUsers: number;
    systemHealth: string;
    lastUpdated: string;
}

interface SystemStatsCardsProps {
    stats: SystemStats;
    isLoading: boolean;
}

const SystemStatsCards: React.FC<SystemStatsCardsProps> = ({ stats, isLoading }) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            description: 'All registered users',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: Activity,
            description: 'Currently online',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Super Admins',
            value: stats.superAdminCount,
            icon: Crown,
            description: 'System administrators',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            change: '0%',
            changeType: 'neutral'
        },
        {
            title: 'Admins',
            value: stats.adminCount,
            icon: Shield,
            description: 'Administrative users',
            color: 'from-indigo-500 to-indigo-600',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-700',
            change: '+2%',
            changeType: 'positive'
        },
        {
            title: 'Instructors',
            value: stats.instructorCount,
            icon: GraduationCap,
            description: 'Course instructors',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Regular Users',
            value: stats.regularUserCount,
            icon: UserCheck,
            description: 'Standard users',
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-700',
            change: '+18%',
            changeType: 'positive'
        }
    ];

    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.title}
                            className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`h-5 w-5 ${stat.textColor}`} />
                                </div>
                            </CardHeader>

                            <CardContent>
                                {isLoading ? (
                                    <LoadingSkeleton />
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-3xl font-bold text-gray-900">
                                            {formatNumber(stat.value)}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">
                                                {stat.description}
                                            </p>
                                            <Badge
                                                variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                                                className={`text-xs ${stat.changeType === 'positive'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {stat.change}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            System Health
                        </CardTitle>
                        <CardDescription>
                            Current system status and performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Overall Status</span>
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                    <Activity className="h-3 w-3 mr-1" />
                                    Healthy
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Server Load</span>
                                <span className="text-sm text-gray-600">23%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Database Status</span>
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                    Online
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">API Response Time</span>
                                <span className="text-sm text-gray-600">142ms</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-purple-600" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Latest system events and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-xs text-gray-500">
                                Last updated: {formatDate(stats.lastUpdated)}
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">System backup completed</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">New user registration</p>
                                        <p className="text-xs text-gray-500">5 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Security scan completed</p>
                                        <p className="text-xs text-gray-500">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SystemStatsCards;