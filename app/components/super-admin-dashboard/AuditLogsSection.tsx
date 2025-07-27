'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Shield,
    Search,
    Filter,
    Download,
    Eye,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Activity,
    Database,
    Settings,
    Lock
} from 'lucide-react';

interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    status: 'success' | 'failed' | 'warning';
    ipAddress: string;
    userAgent: string;
    details: string;
    category: 'authentication' | 'user_management' | 'system' | 'data' | 'security';
}

const AuditLogsSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('24h');

    // Mock audit log data
    const [auditLogs] = useState<AuditLog[]>([
        {
            id: 1,
            timestamp: '2025-01-27T10:30:00Z',
            user: 'john.doe@example.com',
            action: 'User Login',
            resource: 'Authentication System',
            status: 'success',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: 'Successful login from trusted device',
            category: 'authentication'
        },
        {
            id: 2,
            timestamp: '2025-01-27T10:25:00Z',
            user: 'jane.smith@example.com',
            action: 'User Role Updated',
            resource: 'User Management',
            status: 'success',
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            details: 'User mike.johnson@example.com promoted to INSTRUCTOR role',
            category: 'user_management'
        },
        {
            id: 3,
            timestamp: '2025-01-27T10:20:00Z',
            user: 'system',
            action: 'Database Backup',
            resource: 'System Backup',
            status: 'success',
            ipAddress: '127.0.0.1',
            userAgent: 'System Process',
            details: 'Automated daily backup completed successfully',
            category: 'system'
        },
        {
            id: 4,
            timestamp: '2025-01-27T10:15:00Z',
            user: 'unknown',
            action: 'Failed Login Attempt',
            resource: 'Authentication System',
            status: 'failed',
            ipAddress: '203.0.113.45',
            userAgent: 'curl/7.68.0',
            details: 'Multiple failed login attempts detected - IP blocked',
            category: 'security'
        },
        {
            id: 5,
            timestamp: '2025-01-27T10:10:00Z',
            user: 'admin@example.com',
            action: 'System Settings Updated',
            resource: 'System Configuration',
            status: 'success',
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: 'Maintenance mode settings updated',
            category: 'system'
        },
        {
            id: 6,
            timestamp: '2025-01-27T10:05:00Z',
            user: 'sarah.wilson@example.com',
            action: 'Data Export',
            resource: 'User Data',
            status: 'warning',
            ipAddress: '192.168.1.103',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            details: 'Large data export requested - requires approval',
            category: 'data'
        }
    ]);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'authentication':
                return <Lock className="h-4 w-4" />;
            case 'user_management':
                return <User className="h-4 w-4" />;
            case 'system':
                return <Settings className="h-4 w-4" />;
            case 'data':
                return <Database className="h-4 w-4" />;
            case 'security':
                return <Shield className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'authentication':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'user_management':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'system':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'data':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'security':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-orange-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'failed':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'warning':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.resource.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const exportLogs = () => {
        // Handle log export
        console.log('Exporting audit logs...');
    };

    const auditStats = [
        {
            label: 'Total Events',
            value: auditLogs.length,
            icon: Activity,
            color: 'text-blue-600'
        },
        {
            label: 'Success Rate',
            value: `${Math.round((auditLogs.filter(log => log.status === 'success').length / auditLogs.length) * 100)}%`,
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            label: 'Failed Events',
            value: auditLogs.filter(log => log.status === 'failed').length,
            icon: XCircle,
            color: 'text-red-600'
        },
        {
            label: 'Warnings',
            value: auditLogs.filter(log => log.status === 'warning').length,
            icon: AlertTriangle,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Audit Logs
                    </CardTitle>
                    <CardDescription>
                        Monitor system activities and security events
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {auditStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search logs by user, action, or resource..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="authentication">Authentication</SelectItem>
                                <SelectItem value="user_management">User Management</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={exportLogs} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg">Audit Events ({filteredLogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Timestamp</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">IP Address</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {formatDate(log.timestamp)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                                    {log.user.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                                <div className="text-xs text-gray-500">{log.resource}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={getCategoryColor(log.category)}>
                                                {getCategoryIcon(log.category)}
                                                <span className="ml-1 capitalize">{log.category.replace('_', ' ')}</span>
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(log.status)}
                                                <Badge className={getStatusBadgeColor(log.status)}>
                                                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                                            {log.ipAddress}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogsSection;