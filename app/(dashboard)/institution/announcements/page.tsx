"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  Bell,
  Eye,
  CheckCircle,
  Pin,
  TrendingUp
} from "lucide-react";
import { AnnouncementCard } from "@/app/components/institutional/Announcements/AnnouncementCard";
import { AnnouncementForm } from "@/app/components/institutional/Announcements/AnnouncementForm";
import { 
  AnnouncementDTO,
  getAnnouncementsByInstitute,
  deleteAnnouncement,
  markAnnouncementAsViewed,
  acknowledgeAnnouncement,
  getUserId,
  getInstituteByAdminId
} from "@/app/components/services/api";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<AnnouncementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instituteId, setInstituteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Modal states
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDTO | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    // Filter announcements based on search term, type, and priority
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(announcement => announcement.type === typeFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }

    // Sort by pinned first, then by publish date (newest first)
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, typeFilter, priorityFilter]);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      const institute = await getInstituteByAdminId(parseInt(userId));
      setInstituteId(institute.instituteId);
      
      const announcementsData = await getAnnouncementsByInstitute(institute.instituteId);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementSuccess = (announcement: AnnouncementDTO) => {
    if (selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(a => a.announcementId === announcement.announcementId ? announcement : a));
    } else {
      // Add new announcement
      setAnnouncements(prev => [announcement, ...prev]);
    }
    setSelectedAnnouncement(null);
  };

  const handleAnnouncementDelete = async (announcementId: number) => {
    try {
      await deleteAnnouncement(announcementId);
      setAnnouncements(prev => prev.filter(a => a.announcementId !== announcementId));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleAnnouncementView = async (announcementId: number) => {
    try {
      await markAnnouncementAsViewed(announcementId);
      // Update view count locally
      setAnnouncements(prev => prev.map(a => 
        a.announcementId === announcementId 
          ? { ...a, viewCount: a.viewCount + 1 }
          : a
      ));
    } catch (error) {
      console.error('Failed to mark announcement as viewed:', error);
    }
  };

  const handleAnnouncementAcknowledge = async (announcementId: number) => {
    try {
      await acknowledgeAnnouncement(announcementId);
      // Update acknowledge count locally
      setAnnouncements(prev => prev.map(a => 
        a.announcementId === announcementId 
          ? { ...a, acknowledgeCount: a.acknowledgeCount + 1 }
          : a
      ));
    } catch (error) {
      console.error('Failed to acknowledge announcement:', error);
    }
  };

  // Calculate stats
  const totalViews = announcements.reduce((sum, announcement) => sum + announcement.viewCount, 0);
  const totalAcknowledgments = announcements.reduce((sum, announcement) => sum + announcement.acknowledgeCount, 0);
  const pinnedCount = announcements.filter(a => a.isPinned).length;
  const publishedCount = announcements.filter(a => a.isPublished).length;

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
          <p className="text-white text-lg">Loading announcements...</p>
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
                Announcements
              </h1>
              <p className="text-slate-300 mt-1">
                Create and manage announcements for your institution
              </p>
            </div>
            <button 
              onClick={() => setShowAnnouncementForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Announcement</span>
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
            title="Total Announcements"
            value={announcements.length}
            subtitle={`${publishedCount} published`}
            icon={Bell}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <StatCard
            title="Total Views"
            value={totalViews}
            subtitle="Across all announcements"
            icon={Eye}
            color="from-purple-500 to-pink-500"
            index={1}
          />
          <StatCard
            title="Acknowledgments"
            value={totalAcknowledgments}
            subtitle="Total responses"
            icon={CheckCircle}
            color="from-green-500 to-emerald-500"
            index={2}
          />
          <StatCard
            title="Pinned"
            value={pinnedCount}
            subtitle="Important announcements"
            icon={Pin}
            color="from-yellow-500 to-orange-500"
            index={3}
          />
        </motion.div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="all" className="bg-slate-800">All Types</option>
              <option value="GENERAL" className="bg-slate-800">General</option>
              <option value="ACADEMIC" className="bg-slate-800">Academic</option>
              <option value="ADMINISTRATIVE" className="bg-slate-800">Administrative</option>
              <option value="URGENT" className="bg-slate-800">Urgent</option>
              <option value="EVENT" className="bg-slate-800">Event</option>
              <option value="HOLIDAY" className="bg-slate-800">Holiday</option>
              <option value="EXAM" className="bg-slate-800">Exam</option>
              <option value="ASSIGNMENT" className="bg-slate-800">Assignment</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="all" className="bg-slate-800">All Priorities</option>
              <option value="LOW" className="bg-slate-800">Low</option>
              <option value="MEDIUM" className="bg-slate-800">Medium</option>
              <option value="HIGH" className="bg-slate-800">High</option>
              <option value="URGENT" className="bg-slate-800">Urgent</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-full">
                {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        {filteredAnnouncements.length === 0 ? (
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
              <Bell className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm || typeFilter !== "all" || priorityFilter !== "all" 
                  ? 'No announcements found' 
                  : 'No announcements created yet'
                }
              </h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                {searchTerm || typeFilter !== "all" || priorityFilter !== "all"
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first announcement to communicate with your community'
                }
              </p>
              {!searchTerm && typeFilter === "all" && priorityFilter === "all" && (
                <motion.button 
                  onClick={() => setShowAnnouncementForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Announcement</span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.announcementId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
              >
                <AnnouncementCard
                  announcement={announcement}
                  onEdit={(announcement) => {
                    setSelectedAnnouncement(announcement);
                    setShowAnnouncementForm(true);
                  }}
                  onDelete={handleAnnouncementDelete}
                  onView={handleAnnouncementView}
                  onAcknowledge={handleAnnouncementAcknowledge}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {instituteId && (
        <AnnouncementForm
          isOpen={showAnnouncementForm}
          onClose={() => {
            setShowAnnouncementForm(false);
            setSelectedAnnouncement(null);
          }}
          onSuccess={handleAnnouncementSuccess}
          announcement={selectedAnnouncement}
          instituteId={instituteId}
        />
      )}
    </div>
  );
}