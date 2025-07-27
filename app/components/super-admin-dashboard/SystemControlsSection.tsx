'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Settings,
    Power,
    Database,
    Shield,
    AlertTriangle,
    RefreshCw,
    Download,
    Upload,
    Server,
    Lock,
    Unlock,
    Activity,
    HardDrive,
    Wifi,
    Bell
} from 'lucide-react';

const SystemControlsSection: React.FC = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [backupInProgress, setBackupInProgress] = useState(false);
    const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
    const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
    const [systemSettings, setSystemSettings] = useState({
        autoBackup: true,
        securityAlerts: true,
        systemNotifications: true,
        debugMode: false,
        apiRateLimit: true
    });

    const handleMaintenanceToggle = () => {
        setIsMaintenanceDialogOpen(true);
    };

    const confirmMaintenanceToggle = () => {
        setMaintenanceMode(!maintenanceMode);
        setIsMaintenanceDialogOpen(false);
    };

    const handleBackup = () => {
        setIsBackupDialogOpen(true);
    };

    const confirmBackup = async () => {
        setBackupInProgress(true);
        setIsBackupDialogOpen(false);
        
        // Simulate backup process
        setTimeout(() => {
            setBackupInProgress(false);
        }, 3000);
    };

    const handleSettingChange = (setting: string, value: boolean) => {
        setSystemSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const systemControls = [
        {
            title: 'Maintenance Mode',
            description: 'Enable maintenance mode to perform system updates',
            icon: Power,
            action: handleMaintenanceToggle,
            status: maintenanceMode ? 'enabled' : 'disabled',
            color: maintenanceMode ? 'text-red-600' : 'text-green-600',
            bgColor: maintenanceMode ? 'bg-red-50' : 'bg-green-50'
        },
        {
            title: 'System Backup',
            description: 'Create a full system backup',
            icon: Database,
            action: handleBackup,
            status: backupInProgress ? 'in-progress' : 'ready',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            disabled: backupInProgress
        },
        {
            title: 'Clear Cache',
            description: 'Clear all system caches to improve performance',
            icon: RefreshCw,
            action: () => console.log('Clearing cache...'),
            status: 'ready',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Security Scan',
            description: 'Run a comprehensive security scan',
            icon: Shield,
            action: () => console.log('Running security scan...'),
            status: 'ready',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    const systemMetrics = [
        {
            label: 'Server Uptime',
            value: '99.9%',
            icon: Server,
            color: 'text-green-600'
        },
        {
            label: 'Database Health',
            value: 'Optimal',
            icon: Database,
            color: 'text-green-600'
        },
        {
            label: 'API Response Time',
            value: '142ms',
            icon: Activity,
            color: 'text-blue-600'
        },
        {
            label: 'Storage Usage',
            value: '67%',
            icon: HardDrive,
            color: 'text-orange-600'
        },
        {
            label: 'Network Status',
            value: 'Stable',
            icon: Wifi,
            color: 'text-green-600'
        },
        {
            label: 'Security Level',
            value: 'High',
            icon: Shield,
            color: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-600" />
                        System Controls
                    </CardTitle>
                    <CardDescription>
                        Manage system-wide settings and perform administrative tasks
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">System Status</CardTitle>
                        <CardDescription>Current system health and metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {systemMetrics.map((metric, index) => {
                                const Icon = metric.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                                        <div className="p-2 rounded-lg bg-white shadow-sm">
                                            <Icon className={`h-4 w-4 ${metric.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{metric.value}</p>
                                            <p className="text-xs text-gray-500">{metric.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">System Settings</CardTitle>
                        <CardDescription>Configure system-wide preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Auto Backup</span>
                                </div>
                                <Switch
                                    checked={systemSettings.autoBackup}
                                    onCheckedChange={(value) => handleSettingChange('autoBackup', value)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-medium">Security Alerts</span>
                                </div>
                                <Switch
                                    checked={systemSettings.securityAlerts}
                                    onCheckedChange={(value) => handleSettingChange('securityAlerts', value)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">System Notifications</span>
                                </div>
                                <Switch
                                    checked={systemSettings.systemNotifications}
                                    onCheckedChange={(value) => handleSettingChange('systemNotifications', value)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">Debug Mode</span>
                                </div>
                                <Switch
                                    checked={systemSettings.debugMode}
                                    onCheckedChange={(value) => handleSettingChange('debugMode', value)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium">API Rate Limiting</span>
                                </div>
                                <Switch
                                    checked={systemSettings.apiRateLimit}
                                    onCheckedChange={(value) => handleSettingChange('apiRateLimit', value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg">System Operations</CardTitle>
                    <CardDescription>Perform critical system operations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {systemControls.map((control, index) => {
                            const Icon = control.icon;
                            return (
                                <div
                                    key={index}
                                    className={`p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group ${control.bgColor}`}
                                >
                                    <div className="text-center space-y-4">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Icon className={`h-6 w-6 ${control.color}`} />
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-medium text-gray-900">{control.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{control.description}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Badge 
                                                className={`${
                                                    control.status === 'enabled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    control.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    'bg-green-100 text-green-700 border-green-200'
                                                }`}
                                            >
                                                {control.status === 'in-progress' && (
                                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                                )}
                                                {control.status.replace('-', ' ').toUpperCase()}
                                            </Badge>
                                            
                                            <Button
                                                onClick={control.action}
                                                disabled={control.disabled}
                                                size="sm"
                                                className="w-full"
                                                variant={control.status === 'enabled' ? 'destructive' : 'default'}
                                            >
                                                {control.status === 'enabled' ? 'Disable' : 
                                                 control.status === 'in-progress' ? 'Running...' : 'Execute'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance Mode Dialog */}
            <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            {maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
                        </DialogTitle>
                        <DialogDescription>
                            {maintenanceMode 
                                ? 'This will disable maintenance mode and allow users to access the system normally.'
                                : 'This will enable maintenance mode and prevent users from accessing the system. Only SuperAdmins will be able to access the system.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmMaintenanceToggle}
                            variant={maintenanceMode ? 'default' : 'destructive'}
                        >
                            {maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Backup Dialog */}
            <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            Create System Backup
                        </DialogTitle>
                        <DialogDescription>
                            This will create a full backup of the system including database, user data, and configurations. 
                            The process may take several minutes to complete.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmBackup}>
                            Start Backup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SystemControlsSection;