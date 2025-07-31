"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone,
  Users,
  Eye,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParentProfileDTO } from "@/app/components/services/api";

interface ParentCardProps {
  parent: ParentProfileDTO;
  onEdit?: (parent: ParentProfileDTO) => void;
  onDelete?: (parentId: number) => void;
  onViewChildren?: (parentId: number) => void;
  onViewProgress?: (parentId: number) => void;
  className?: string;
}

export function ParentCard({ 
  parent, 
  onEdit, 
  onDelete, 
  onViewChildren,
  onViewProgress,
  className 
}: ParentCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete parent profile for "${parent.parentName}"?`)) {
      setIsLoading(true);
      try {
        await onDelete?.(parent.parentId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPermissionsBadges = () => {
    const permissions = [];
    if (parent.canViewReports) permissions.push('Reports');
    if (parent.canViewAttendance) permissions.push('Attendance');
    if (parent.canViewGrades) permissions.push('Grades');
    if (parent.canViewAnnouncements) permissions.push('Announcements');
    return permissions;
  };

  return (
    <motion.div 
      className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl group ${className}`}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <motion.h3 
            className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <User className="h-5 w-5 text-slate-400" />
            {parent.parentName}
          </motion.h3>
          <motion.p 
            className="text-slate-300 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {parent.relationship} • {parent.children.length} child{parent.children.length !== 1 ? 'ren' : ''}
          </motion.p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.span 
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              parent.isActive 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {parent.isActive ? 'Active' : 'Inactive'}
          </motion.span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal className="h-4 w-4 text-white" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800/95 backdrop-blur-lg border-white/20">
              <DropdownMenuItem onClick={() => onViewChildren?.(parent.parentId)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Users className="mr-2 h-4 w-4" />
                View Children
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewProgress?.(parent.parentId)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Eye className="mr-2 h-4 w-4" />
                View Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(parent)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="truncate">{parent.parentEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{parent.phoneNumber}</span>
          </div>
        </div>

        {/* Children List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-400">Children:</h4>
          <div className="space-y-1">
            {parent.children.slice(0, 3).map((child) => (
              <div key={child.id} className="flex items-center gap-2 text-sm text-slate-300">
                <UserCheck className="h-3 w-3 text-slate-400" />
                <span>{child.firstName} {child.lastName}</span>
              </div>
            ))}
            {parent.children.length > 3 && (
              <div className="text-xs text-slate-400">
                +{parent.children.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-400">Permissions:</h4>
          <div className="flex flex-wrap gap-1">
            {getPermissionsBadges().map((permission) => (
              <span key={permission} className="px-2 py-1 text-xs bg-white/20 text-slate-300 rounded-full">
                {permission}
              </span>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-400">Notifications:</h4>
          <div className="flex gap-2">
            {parent.emailNotifications && (
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                Email
              </span>
            )}
            {parent.smsNotifications && (
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                SMS
              </span>
            )}
            {!parent.emailNotifications && !parent.smsNotifications && (
              <span className="text-xs text-slate-400">None enabled</span>
            )}
          </div>
        </div>

        {/* Last Login */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>Last login:</span>
            <span>{formatDate(parent.lastLoginDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}