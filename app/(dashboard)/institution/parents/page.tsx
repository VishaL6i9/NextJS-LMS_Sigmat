"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  Users,
  Mail,
  Phone,
  UserCheck,
  TrendingUp
} from "lucide-react";
import { ParentCard } from "@/app/components/institutional/ParentEngagement/ParentCard";
import { ParentForm } from "@/app/components/institutional/ParentEngagement/ParentForm";
import { 
  ParentProfileDTO,
  getParentsByInstitute,
  deleteParentProfile,
  getUserId,
  getInstituteByAdminId
} from "@/app/components/services/api";

export default function ParentsPage() {
  const [parents, setParents] = useState<ParentProfileDTO[]>([]);
  const [filteredParents, setFilteredParents] = useState<ParentProfileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instituteId, setInstituteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal states
  const [showParentForm, setShowParentForm] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentProfileDTO | null>(null);

  useEffect(() => {
    loadParents();
  }, []);

  useEffect(() => {
    // Filter parents based on search term, relationship, and status
    let filtered = parents;

    if (searchTerm) {
      filtered = filtered.filter(parent =>
        parent.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.phoneNumber.includes(searchTerm) ||
        parent.children.some(child => 
          `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (relationshipFilter !== "all") {
      filtered = filtered.filter(parent => parent.relationship === relationshipFilter);
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(parent => parent.isActive === isActive);
    }

    // Sort by name
    filtered.sort((a, b) => a.parentName.localeCompare(b.parentName));

    setFilteredParents(filtered);
  }, [parents, searchTerm, relationshipFilter, statusFilter]);

  const loadParents = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      const institute = await getInstituteByAdminId(parseInt(userId));
      setInstituteId(institute.instituteId);
      
      const parentsData = await getParentsByInstitute(institute.instituteId);
      setParents(parentsData);
    } catch (error) {
      console.error('Failed to load parents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParentSuccess = (parent: ParentProfileDTO) => {
    if (selectedParent) {
      // Update existing parent
      setParents(prev => prev.map(p => p.parentId === parent.parentId ? parent : p));
    } else {
      // Add new parent
      setParents(prev => [parent, ...prev]);
    }
    setSelectedParent(null);
  };

  const handleParentDelete = async (parentId: number) => {
    try {
      await deleteParentProfile(parentId);
      setParents(prev => prev.filter(p => p.parentId !== parentId));
    } catch (error) {
      console.error('Failed to delete parent:', error);
    }
  };

  // Calculate stats
  const totalChildren = parents.reduce((sum, parent) => sum + parent.children.length, 0);
  const activeParents = parents.filter(p => p.isActive).length;
  const emailNotificationsEnabled = parents.filter(p => p.emailNotifications).length;
  const smsNotificationsEnabled = parents.filter(p => p.smsNotifications).length;

  // Get unique relationships for filter
  const relationships = Array.from(new Set(parents.map(p => p.relationship))).sort();

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
          <p className="text-white text-lg">Loading parents...</p>
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
                Parent Management
              </h1>
              <p className="text-slate-300 mt-1">
                Manage parent profiles and engagement
              </p>
            </div>
            <button 
              onClick={() => setShowParentForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Parent</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Parents"
            value={parents.length}
            subtitle={`${activeParents} active`}
            icon={Users}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <StatCard
            title="Children Covered"
            value={totalChildren}
            subtitle="Students with parent profiles"
            icon={UserCheck}
            color="from-purple-500 to-pink-500"
            index={1}
          />
          <StatCard
            title="Email Notifications"
            value={emailNotificationsEnabled}
            subtitle="Parents subscribed"
            icon={Mail}
            color="from-green-500 to-emerald-500"
            index={2}
          />
          <StatCard
            title="SMS Notifications"
            value={smsNotificationsEnabled}
            subtitle="Parents subscribed"
            icon={Phone}
            color="from-yellow-500 to-orange-500"
            index={3}
          />
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search parents or children..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={relationshipFilter}
              onChange={(e) => setRelationshipFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="all" className="bg-slate-800">All Relationships</option>
              {relationships.map((relationship) => (
                <option key={relationship} value={relationship} className="bg-slate-800">
                  {relationship}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="active" className="bg-slate-800">Active</option>
              <option value="inactive" className="bg-slate-800">Inactive</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-full">
                {filteredParents.length} parent{filteredParents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Parents Grid */}
        {filteredParents.length === 0 ? (
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
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm || relationshipFilter !== "all" || statusFilter !== "all"
                  ? 'No parents found' 
                  : 'No parent profiles created yet'
                }
              </h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                {searchTerm || relationshipFilter !== "all" || statusFilter !== "all"
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating parent profiles to enhance family engagement'
                }
              </p>
              {!searchTerm && relationshipFilter === "all" && statusFilter === "all" && (
                <motion.button 
                  onClick={() => setShowParentForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Parent Profile</span>
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
            {filteredParents.map((parent, index) => (
              <motion.div
                key={parent.parentId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
              >
                <ParentCard
                  parent={parent}
                  onEdit={(parent) => {
                    setSelectedParent(parent);
                    setShowParentForm(true);
                  }}
                  onDelete={handleParentDelete}
                  onViewChildren={(parentId) => {
                    // TODO: Implement view children modal
                    console.log('View children for parent:', parentId);
                  }}
                  onViewProgress={(parentId) => {
                    // TODO: Implement view progress modal
                    console.log('View progress for parent:', parentId);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {instituteId && (
        <ParentForm
          isOpen={showParentForm}
          onClose={() => {
            setShowParentForm(false);
            setSelectedParent(null);
          }}
          onSuccess={handleParentSuccess}
          parent={selectedParent}
          instituteId={instituteId}
        />
      )}
    </div>
  );
}