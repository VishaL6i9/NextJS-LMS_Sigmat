"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Eye,
  CheckCircle,
  Pin,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  BookOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnnouncementDTO } from "@/app/components/services/api";

interface AnnouncementCardProps {
  announcement: AnnouncementDTO;
  onEdit?: (announcement: AnnouncementDTO) => void;
  onDelete?: (announcementId: number) => void;
  onView?: (announcementId: number) => void;
  onAcknowledge?: (announcementId: number) => void;
  showActions?: boolean;
  className?: string;
}

const typeColors = {
  GENERAL: "bg-gray-100 text-gray-800",
  ACADEMIC: "bg-blue-100 text-blue-800",
  ADMINISTRATIVE: "bg-purple-100 text-purple-800",
  URGENT: "bg-red-100 text-red-800",
  EVENT: "bg-green-100 text-green-800",
  HOLIDAY: "bg-yellow-100 text-yellow-800",
  EXAM: "bg-orange-100 text-orange-800",
  ASSIGNMENT: "bg-indigo-100 text-indigo-800"
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700"
};

export function AnnouncementCard({ 
  announcement, 
  onEdit, 
  onDelete, 
  onView,
  onAcknowledge,
  showActions = true,
  className 
}: AnnouncementCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      setIsLoading(true);
      try {
        await onDelete?.(announcement.announcementId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleView = async () => {
    await onView?.(announcement.announcementId);
  };

  const handleAcknowledge = async () => {
    await onAcknowledge?.(announcement.announcementId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = announcement.expiryDate && new Date(announcement.expiryDate) < new Date();

  return (
    <motion.div 
      className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl group ${isExpired ? 'opacity-75' : ''} ${className}`}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            {announcement.isPinned && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <Pin className="h-4 w-4 text-blue-400" />
              </motion.div>
            )}
            <motion.h3 
              className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {announcement.title}
            </motion.h3>
          </div>
          <motion.div 
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.span 
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                announcement.type === 'URGENT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                announcement.type === 'ACADEMIC' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                announcement.type === 'EVENT' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                announcement.type === 'EXAM' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {announcement.type}
            </motion.span>
            <motion.span 
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                announcement.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                announcement.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                announcement.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {announcement.priority}
            </motion.span>
            {isExpired && (
              <motion.span 
                className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Expired
              </motion.span>
            )}
          </motion.div>
        </div>
        
        {showActions && (
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
              <DropdownMenuItem onClick={handleView} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {onAcknowledge && (
                <DropdownMenuItem onClick={handleAcknowledge} className="text-slate-300 hover:text-white hover:bg-white/10">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Acknowledge
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(announcement)} className="text-slate-300 hover:text-white hover:bg-white/10">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.p 
          className="text-slate-300 text-sm line-clamp-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {announcement.content}
        </motion.p>
        
        <motion.div 
          className="space-y-2 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-slate-300">
            <User className="h-4 w-4 text-slate-400" />
            <span>{announcement.authorName}</span>
            {announcement.authorRole && (
              <span className="px-2 py-1 text-xs bg-white/20 text-slate-300 rounded-full">
                {announcement.authorRole}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Published: {formatDate(announcement.publishDate)}</span>
          </div>
          
          {announcement.expiryDate && (
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className={isExpired ? 'text-red-400' : ''}>
                Expires: {formatDate(announcement.expiryDate)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Targeting Information */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {announcement.targetRoles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users className="h-4 w-4 text-slate-400" />
              <span>Roles: {announcement.targetRoles.join(', ')}</span>
            </div>
          )}
          
          {announcement.targetBatches.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span>Batches: {announcement.targetBatches.length} selected</span>
            </div>
          )}
        </motion.div>

        {/* Engagement Stats */}
        <motion.div 
          className="flex items-center justify-between pt-4 border-t border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="h-3 w-3" />
              <span>{announcement.viewCount} views</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="h-3 w-3" />
              <span>{announcement.acknowledgeCount} acknowledged</span>
            </motion.div>
          </div>
          
          {announcement.attachmentUrls.length > 0 && (
            <motion.span 
              className="px-2 py-1 text-xs bg-white/20 text-slate-300 rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              {announcement.attachmentUrls.length} attachment{announcement.attachmentUrls.length !== 1 ? 's' : ''}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}