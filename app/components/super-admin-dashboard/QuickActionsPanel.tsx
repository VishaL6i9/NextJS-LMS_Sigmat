'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Zap,
    UserPlus,
    Mail,
    Bell,
    Database,
    Shield,
    Settings,
    Users,
    Crown,
    AlertTriangle,
    Send,
    Plus,
    RefreshCw,
    Download,
    Upload,
    Lock,
    Unlock
} from 'lucide-react';

const QuickActionsPanel: React.FC = () => {
    const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
    const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
    const [isSystemAlertDialogOpen, setIsSystemAlertDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'USER'
    });
    const [broadcastMessage, setBroadcastMessage] = useState({
        title: '',
        message: '',
        type: 'info',
        targetRole: 'all'
    });
    const [systemAlert, setSystemAlert] = useState({
        title: '',
        message: '',
        severity: 'info'
    });

    const quickActions = [
        {
            title: 'Create User',
            description: 'Add a new user to the system',
            icon: UserPlus,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            action: () => setIsCreateUserDialogOpen(true)
        },
        {
            title: 'Broadcast Message',
            description: 'Send message to all users',
            icon: Mail,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            action: () => setIsBroadcastDialogOpen(true)
        },
        {
            title: 'System Alert',
            description: 'Create system-wide alert',
            icon: Bell,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700',
            action: () => setIsSystemAlertDialogOpen(true)
        },
        {
            title: 'Database Backup',
            description: 'Create immediate backup',
            icon: Database,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            action: () => console.log('Creating backup...')
        },
        {
            title: 'Security Scan',
            description: 'Run security analysis',
            icon: Shield,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            action: () => console.log('Running security scan...')
        },
        {
            title: 'Clear Cache',
            description: 'Clear all system caches',
            icon: RefreshCw,
            color: 'from-indigo-500 to-indigo-600',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-700',
            action: () => console.log('Clearing cache...')
        },
        {
            title: 'Export Data',
            description: 'Export system data',
            icon: Download,
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-700',
            action: () => console.log('Exporting data...')
        },
        {
            title: 'System Settings',
            description: 'Quick system configuration',
            icon: Settings,
            color: 'from-gray-500 to-gray-600',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            action: () => console.log('Opening settings...')
        }
    ];

    const recentActions = [
        {
            action: 'User Created',
            details: 'New instructor account created for john.doe@example.com',
            timestamp: '2 minutes ago',
            status: 'success'
        },
        {
            action: 'System Backup',
            details: 'Daily backup completed successfully',
            timestamp: '1 hour ago',
            status: 'success'
        },
        {
            action: 'Security Alert',
            details: 'Multiple failed login attempts detected',
            timestamp: '3 hours ago',
            status: 'warning'
        },
        {
            action: 'Broadcast Sent',
            details: 'Maintenance notification sent to all users',
            timestamp: '1 day ago',
            status: 'success'
        }
    ];

    const handleCreateUser = () => {
        // Handle user creation
        console.log('Creating user:', newUser);
        setIsCreateUserDialogOpen(false);
        setNewUser({ name: '', email: '', role: 'USER' });
    };

    const handleBroadcastMessage = () => {
        // Handle broadcast message
        console.log('Broadcasting message:', broadcastMessage);
        setIsBroadcastDialogOpen(false);
        setBroadcastMessage({ title: '', message: '', type: 'info', targetRole: 'all' });
    };

    const handleSystemAlert = () => {
        // Handle system alert
        console.log('Creating system alert:', systemAlert);
        setIsSystemAlertDialogOpen(false);
        setSystemAlert({ title: '', message: '', severity: 'info' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'warning':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'error':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Quick Actions
                    </CardTitle>
                    <CardDescription>
                        Perform common administrative tasks quickly
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Grid */}
                <div className="lg:col-span-2">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Available Actions</CardTitle>
                            <CardDescription>Click on any action to execute</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group cursor-pointer ${action.bgColor}`}
                                            onClick={action.action}
                                        >
                                            <div className="text-center space-y-3">
                                                <div className="mx-auto w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className={`h-6 w-6 ${action.textColor}`} />
                                                </div>
                                                
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Actions */}
                <div>
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Actions</CardTitle>
                            <CardDescription>Latest administrative activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActions.map((action, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {action.action}
                                                </p>
                                                <Badge className={getStatusColor(action.status)}>
                                                    {action.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">{action.details}</p>
                                            <p className="text-xs text-gray-400">{action.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create User Dialog */}
            <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                            Create New User
                        </DialogTitle>
                        <DialogDescription>
                            Add a new user to the system with specified role and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <Input
                                placeholder="Enter full name"
                                value={newUser.name}
                                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                value={newUser.email}
                                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>
                            Create User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Broadcast Message Dialog */}
            <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-green-600" />
                            Broadcast Message
                        </DialogTitle>
                        <DialogDescription>
                            Send a message to all users or specific user groups.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Message Title</label>
                            <Input
                                placeholder="Enter message title"
                                value={broadcastMessage.title}
                                onChange={(e) => setBroadcastMessage(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Message Content</label>
                            <Textarea
                                placeholder="Enter your message"
                                value={broadcastMessage.message}
                                onChange={(e) => setBroadcastMessage(prev => ({ ...prev, message: e.target.value }))}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Message Type</label>
                                <Select value={broadcastMessage.type} onValueChange={(value) => setBroadcastMessage(prev => ({ ...prev, type: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="error">Error</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Target Audience</label>
                                <Select value={broadcastMessage.targetRole} onValueChange={(value) => setBroadcastMessage(prev => ({ ...prev, targetRole: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value="USER">Users Only</SelectItem>
                                        <SelectItem value="INSTRUCTOR">Instructors Only</SelectItem>
                                        <SelectItem value="ADMIN">Admins Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBroadcastDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBroadcastMessage}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* System Alert Dialog */}
            <Dialog open={isSystemAlertDialogOpen} onOpenChange={setIsSystemAlertDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-orange-600" />
                            Create System Alert
                        </DialogTitle>
                        <DialogDescription>
                            Create a system-wide alert that will be displayed to all users.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Alert Title</label>
                            <Input
                                placeholder="Enter alert title"
                                value={systemAlert.title}
                                onChange={(e) => setSystemAlert(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Alert Message</label>
                            <Textarea
                                placeholder="Enter alert message"
                                value={systemAlert.message}
                                onChange={(e) => setSystemAlert(prev => ({ ...prev, message: e.target.value }))}
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Severity Level</label>
                            <Select value={systemAlert.severity} onValueChange={(value) => setSystemAlert(prev => ({ ...prev, severity: value }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSystemAlertDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSystemAlert}>
                            Create Alert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuickActionsPanel;