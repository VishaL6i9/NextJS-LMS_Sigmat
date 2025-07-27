'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false });
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    Crown,
    Shield,
    GraduationCap,
    User,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ArrowUpDown
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'USER';
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    joinDate: string;
}

const UserManagementSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Mock user data
    const [users] = useState<User[]>([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'SUPER_ADMIN',
            status: 'active',
            lastLogin: '2025-01-27T10:30:00Z',
            joinDate: '2024-01-15T09:00:00Z'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'ADMIN',
            status: 'active',
            lastLogin: '2025-01-27T09:15:00Z',
            joinDate: '2024-02-20T14:30:00Z'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'INSTRUCTOR',
            status: 'active',
            lastLogin: '2025-01-26T16:45:00Z',
            joinDate: '2024-03-10T11:20:00Z'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            role: 'USER',
            status: 'inactive',
            lastLogin: '2025-01-25T08:30:00Z',
            joinDate: '2024-04-05T13:15:00Z'
        },
        {
            id: 5,
            name: 'David Brown',
            email: 'david.brown@example.com',
            role: 'INSTRUCTOR',
            status: 'suspended',
            lastLogin: '2025-01-20T12:00:00Z',
            joinDate: '2024-05-12T10:45:00Z'
        }
    ]);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <Crown className="h-4 w-4" />;
            case 'ADMIN':
                return <Shield className="h-4 w-4" />;
            case 'INSTRUCTOR':
                return <GraduationCap className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'ADMIN':
                return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'INSTRUCTOR':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'suspended':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handlePromoteUser = (user: User) => {
        setSelectedUser(user);
        setIsPromoteDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmPromotion = () => {
        // Handle promotion logic here
        console.log('Promoting user:', selectedUser);
        setIsPromoteDialogOpen(false);
        setSelectedUser(null);
    };

    const confirmDeletion = () => {
        // Handle deletion logic here
        console.log('Deleting user:', selectedUser);
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        User Management
                    </CardTitle>
                    <CardDescription>
                        Manage users, roles, and permissions across the system
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Filters and Search */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                        <Button variant="ghost" size="sm" className="h-auto p-0 font-medium">
                                            User
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Last Login</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Join Date</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {getRoleIcon(user.role)}
                                                <span className="ml-1">{user.role.replace('_', ' ')}</span>
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={getStatusBadgeColor(user.status)}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {formatDate(user.lastLogin)}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {formatDate(user.joinDate)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handlePromoteUser(user)}
                                                    disabled={user.role === 'SUPER_ADMIN'}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user)}
                                                    disabled={user.role === 'SUPER_ADMIN'}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Promotion Dialog */}
            <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Promote User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to promote {selectedUser?.name} to a higher role?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmPromotion}>
                            Confirm Promotion
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeletion}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagementSection;