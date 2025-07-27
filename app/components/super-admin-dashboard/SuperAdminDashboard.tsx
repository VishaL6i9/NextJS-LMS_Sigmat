'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false });
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Shield,
    Activity,
    Settings,
    Crown,
    UserCheck,
    AlertTriangle,
    TrendingUp,
    Database,
    Clock,
    Zap,
    BarChart3,
    UserPlus,
    Trash2,
    Eye,
    RefreshCw
} from 'lucide-react';
import SystemStatsCards from './SystemStatsCards';
import UserManagementSection from './UserManagementSection';
import SystemControlsSection from './SystemControlsSection';
import AuditLogsSection from './AuditLogsSection';
import QuickActionsPanel from './QuickActionsPanel';

const SuperAdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        adminCount: 0,
        superAdminCount: 0,
        instructorCount: 0,
        regularUserCount: 0,
        activeUsers: 0,
        systemHealth: 'healthy',
        lastUpdated: new Date().toISOString()
    });

    useEffect(() => {
        // Simulate loading system stats
        const loadSystemStats = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSystemStats({
                totalUsers: 1547,
                adminCount: 8,
                superAdminCount: 2,
                instructorCount: 67,
                regularUserCount: 1470,
                activeUsers: 234,
                systemHealth: 'healthy',
                lastUpdated: new Date().toISOString()
            });
            setIsLoading(false);
        };

        loadSystemStats();
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 800));
        setSystemStats(prev => ({
            ...prev,
            lastUpdated: new Date().toISOString()
        }));
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                                        <Crown className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            SuperAdmin Dashboard
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            System-wide administration and monitoring
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="px-3 py-1 bg-green-100 text-green-700 border-green-200">
                                    <Activity className="h-4 w-4 mr-1" />
                                    System Healthy
                                </Badge>
                                <Button
                                    onClick={refreshData}
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading}
                                    className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                >
                                    <span><RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /></span>
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-1 shadow-lg">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Users className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Users</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="system"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">System</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="audit"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Shield className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Audit</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="actions"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Actions</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <SystemStatsCards stats={systemStats} isLoading={isLoading} />

                        {/* Quick Actions Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Quick Actions</p>
                                            <p className="text-2xl font-bold text-gray-900">8</p>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Zap className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">System Alerts</p>
                                            <p className="text-2xl font-bold text-gray-900">3</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-xl">
                                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Data Trends</p>
                                            <p className="text-2xl font-bold text-green-600">+24%</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Last Backup</p>
                                            <p className="text-sm font-bold text-gray-900">2h ago</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-xl">
                                            <Database className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        {/* Quick User Actions */}
                        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick User Actions</CardTitle>
                                <CardDescription>Common user management tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Add User
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        View All
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        Verify Users
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                        Cleanup
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <UserManagementSection />
                    </TabsContent>

                    <TabsContent value="system" className="space-y-6">
                        {/* System Status Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">System Uptime</p>
                                            <p className="text-lg font-bold text-gray-900">99.9%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Database className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Database Health</p>
                                            <p className="text-lg font-bold text-green-600">Optimal</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                                            <p className="text-lg font-bold text-orange-600">2</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <SystemControlsSection />
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-6">
                        <AuditLogsSection />
                    </TabsContent>

                    <TabsContent value="actions" className="space-y-6">
                        <QuickActionsPanel />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;