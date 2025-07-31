"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BatchDTO } from "@/app/components/services/api";

interface BatchCardProps {
  batch: BatchDTO;
  onEdit?: (batch: BatchDTO) => void;
  onDelete?: (batchId: number) => void;
  onViewStudents?: (batchId: number) => void;
  onAssignStudents?: (batchId: number) => void;
  className?: string;
}

const statusColors = {
  PLANNED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800", 
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-yellow-100 text-yellow-800"
};

export function BatchCard({ 
  batch, 
  onEdit, 
  onDelete, 
  onViewStudents, 
  onAssignStudents,
  className 
}: BatchCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete batch "${batch.batchName}"?`)) {
      setIsLoading(true);
      try {
        await onDelete?.(batch.batchId);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    if (batch.maxStudents === 0) return 0;
    return Math.round((batch.currentStudents / batch.maxStudents) * 100);
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
            className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {batch.batchName}
          </motion.h3>
          <motion.p 
            className="text-slate-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {batch.batchCode} • {batch.courseName}
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          <motion.span 
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              batch.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              batch.status === 'PLANNED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              batch.status === 'COMPLETED' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
              batch.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {batch.status}
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
              <DropdownMenuItem onClick={() => onViewStudents?.(batch.batchId)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Eye className="mr-2 h-4 w-4" />
                View Students
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssignStudents?.(batch.batchId)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Students
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(batch)} className="text-slate-300 hover:text-white hover:bg-white/10">
                <Edit className="mr-2 h-4 w-4" />
                Edit Batch
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {batch.description && (
          <motion.p 
            className="text-slate-300 text-sm line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {batch.description}
          </motion.p>
        )}
        
        <motion.div 
          className="grid grid-cols-2 gap-4 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              {batch.currentStudents}/{batch.maxStudents} students
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>{batch.instructorName}</span>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
            </span>
          </div>
          
          {batch.semester && (
            <div className="text-sm text-slate-400">
              {batch.semester} • {batch.academicYear}
            </div>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex justify-between text-sm text-slate-300">
            <span>Enrollment Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}