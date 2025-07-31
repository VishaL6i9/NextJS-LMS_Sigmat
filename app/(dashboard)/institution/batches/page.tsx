"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { BatchCard } from "@/app/components/institutional/BatchManagement/BatchCard";
import { BatchForm } from "@/app/components/institutional/BatchManagement/BatchForm";
import { BatchStudentList } from "@/app/components/institutional/BatchManagement/BatchStudentList";
import { BatchAssignment } from "@/app/components/institutional/BatchManagement/BatchAssignment";
import { 
  BatchDTO,
  getBatchesByInstitute,
  deleteBatch,
  getUserId,
  getInstituteByAdminId
} from "@/app/components/services/api";

export default function BatchesPage() {
  const [batches, setBatches] = useState<BatchDTO[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<BatchDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instituteId, setInstituteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal states
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showBatchAssignment, setShowBatchAssignment] = useState(false);
  
  // Selected items
  const [selectedBatch, setSelectedBatch] = useState<BatchDTO | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    // Filter batches based on search term and status
    let filtered = batches;

    if (searchTerm) {
      filtered = filtered.filter(batch =>
        batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(batch => batch.status === statusFilter);
    }

    setFilteredBatches(filtered);
  }, [batches, searchTerm, statusFilter]);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      const institute = await getInstituteByAdminId(parseInt(userId));
      setInstituteId(institute.instituteId);
      
      const batchesData = await getBatchesByInstitute(institute.instituteId);
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchSuccess = (batch: BatchDTO) => {
    if (selectedBatch) {
      // Update existing batch
      setBatches(prev => prev.map(b => b.batchId === batch.batchId ? batch : b));
    } else {
      // Add new batch
      setBatches(prev => [batch, ...prev]);
    }
    setSelectedBatch(null);
  };

  const handleBatchDelete = async (batchId: number) => {
    try {
      await deleteBatch(batchId);
      setBatches(prev => prev.filter(b => b.batchId !== batchId));
    } catch (error) {
      console.error('Failed to delete batch:', error);
    }
  };

  // Calculate stats
  const totalStudents = batches.reduce((sum, batch) => sum + batch.currentStudents, 0);
  const activeBatches = batches.filter(b => b.status === 'ACTIVE').length;
  const totalCapacity = batches.reduce((sum, batch) => sum + batch.maxStudents, 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    index
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl group"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className={`p-3 rounded-2xl bg-gradient-to-r ${color}`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-slate-300 text-sm">{title}</p>
        <p className="text-slate-400 text-xs">{subtitle}</p>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Batch Management
              </h1>
              <p className="text-slate-300 mt-1">
                Manage your institution's batches and student assignments
              </p>
            </div>
            <button 
              onClick={() => setShowBatchForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Batch</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            title="Total Batches"
            value={batches.length}
            subtitle={`${activeBatches} active`}
            icon={BookOpen}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Across all batches"
            icon={Users}
            color="from-purple-500 to-pink-500"
            index={1}
          />
          <StatCard
            title="Capacity Utilization"
            value={`${utilizationRate}%`}
            subtitle={`${totalStudents}/${totalCapacity} seats`}
            icon={BarChart3}
            color="from-green-500 to-emerald-500"
            index={2}
          />
          <StatCard
            title="Avg. Batch Size"
            value={batches.length > 0 ? Math.round(totalStudents / batches.length) : 0}
            subtitle="Students per batch"
            icon={TrendingUp}
            color="from-yellow-500 to-orange-500"
            index={3}
          />
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="PLANNED" className="bg-slate-800">Planned</option>
              <option value="ACTIVE" className="bg-slate-800">Active</option>
              <option value="COMPLETED" className="bg-slate-800">Completed</option>
              <option value="CANCELLED" className="bg-slate-800">Cancelled</option>
              <option value="SUSPENDED" className="bg-slate-800">Suspended</option>
            </select>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <span className="px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-full">
                {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Batches Grid */}
        {filteredBatches.length === 0 ? (
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm || statusFilter !== "all" ? 'No batches found' : 'No batches created yet'}
              </h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first batch to organize your students'
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <motion.button 
                  onClick={() => setShowBatchForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Batch</span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {filteredBatches.map((batch, index) => (
              <motion.div
                key={batch.batchId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
              >
                <BatchCard
                  batch={batch}
                  onEdit={(batch) => {
                    setSelectedBatch(batch);
                    setShowBatchForm(true);
                  }}
                  onDelete={handleBatchDelete}
                  onViewStudents={(batchId) => {
                    setSelectedBatchId(batchId);
                    setShowStudentList(true);
                  }}
                  onAssignStudents={(batchId) => {
                    setSelectedBatchId(batchId);
                    setShowBatchAssignment(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {instituteId && (
        <>
          <BatchForm
            isOpen={showBatchForm}
            onClose={() => {
              setShowBatchForm(false);
              setSelectedBatch(null);
            }}
            onSuccess={handleBatchSuccess}
            batch={selectedBatch}
            instituteId={instituteId}
          />

          <BatchStudentList
            isOpen={showStudentList}
            onClose={() => {
              setShowStudentList(false);
              setSelectedBatchId(null);
            }}
            batchId={selectedBatchId}
            batchName={batches.find(b => b.batchId === selectedBatchId)?.batchName}
          />

          <BatchAssignment
            isOpen={showBatchAssignment}
            onClose={() => {
              setShowBatchAssignment(false);
              setSelectedBatchId(null);
            }}
            batchId={selectedBatchId}
            batchName={batches.find(b => b.batchId === selectedBatchId)?.batchName}
            instituteId={instituteId}
            onSuccess={() => {
              // Reload batches to update student counts
              loadBatches();
            }}
          />
        </>
      )}
    </div>
  );
}