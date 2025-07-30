'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Award, 
  TrendingUp,
  Upload,
  UserPlus,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Facebook,
  Youtube
} from 'lucide-react';
import { Download } from '@/components/ui/Download';
import { Users } from '@/components/ui/Users';
import { Linkedin } from '@/components/ui/Linkedin';
import { 
  getInstituteByAdminId, 
  getInstituteInstructors,
  addInstructorToInstitute,
  removeInstructorFromInstitute,
  getUserId,
  InstituteDTO,
  InstructorDTO
} from '@/app/components/services/api';

interface InstructorWithDetails extends InstructorDTO {
  coursesTeaching: number;
  totalStudents: number;
  averageRating: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'on-leave';
  specializations: string[];
}

const InstructorsManagement = () => {
  const [institute, setInstitute] = useState<InstituteDTO | null>(null);
  const [instructors, setInstructors] = useState<InstructorWithDetails[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<InstructorWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadInstructorsData();
  }, []);

  useEffect(() => {
    filterInstructors();
  }, [instructors, searchTerm, filterStatus]);

  const loadInstructorsData = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const instituteData = await getInstituteByAdminId(parseInt(userId));
      setInstitute(instituteData);

      const instructorsData = await getInstituteInstructors(instituteData.instituteId);
      
      // Mock additional data for demonstration
      const instructorsWithDetails: InstructorWithDetails[] = instructorsData.map((instructor, index) => ({
        ...instructor,
        coursesTeaching: Math.floor(Math.random() * 5) + 1,
        totalStudents: Math.floor(Math.random() * 200) + 20,
        averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        lastActive: `${Math.floor(Math.random() * 7) + 1} days ago`,
        status: ['active', 'inactive', 'on-leave'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'on-leave',
        specializations: ['JavaScript', 'Python', 'Data Science', 'Machine Learning', 'Web Development'].slice(0, Math.floor(Math.random() * 3) + 1)
      }));

      setInstructors(instructorsWithDetails);
    } catch (error) {
      console.error('Failed to load instructors data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInstructors = () => {
    let filtered = instructors;

    if (searchTerm) {
      filtered = filtered.filter(instructor => 
        instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(instructor => instructor.status === filterStatus);
    }

    setFilteredInstructors(filtered);
  };

  const handleSelectInstructor = (instructorId: number) => {
    setSelectedInstructors(prev => 
      prev.includes(instructorId) 
        ? prev.filter(id => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'inactive': return 'from-yellow-500 to-orange-500';
      case 'on-leave': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'on-leave': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const InstructorCard = ({ instructor, index }: { instructor: InstructorWithDetails; index: number }) => (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedInstructors.includes(instructor.instructorId)}
            onChange={() => handleSelectInstructor(instructor.instructorId)}
            className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
          />
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {instructor.firstName[0]}{instructor.lastName[0]}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(instructor.status)} text-white text-xs font-medium flex items-center space-x-1`}>
            {getStatusIcon(instructor.status)}
            <span className="capitalize">{instructor.status.replace('-', ' ')}</span>
          </div>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{instructor.firstName} {instructor.lastName}</h3>
          <p className="text-slate-300 text-sm">Joined {new Date(instructor.dateOfJoining).toLocaleDateString()}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-slate-300 text-sm">
            <Mail className="w-4 h-4 mr-2" />
            {instructor.email}
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <Phone className="w-4 h-4 mr-2" />
            {instructor.phoneNo}
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Last active: {instructor.lastActive}
          </div>
        </div>

        {/* Social Media Links */}
        {(instructor.facebookHandle || instructor.linkedinHandle || instructor.youtubeHandle) && (
          <div className="flex items-center space-x-2 pt-2">
            {instructor.facebookHandle && (
              <a href={`https://facebook.com/${instructor.facebookHandle}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <Facebook className="w-4 h-4 text-blue-400" />
              </a>
            )}
            {instructor.linkedinHandle && (
              <a href={`https://linkedin.com/in/${instructor.linkedinHandle}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-700/20 hover:bg-blue-700/30 transition-colors">
                <Linkedin className="w-4 h-4 text-blue-500" />
              </a>
            )}
            {instructor.youtubeHandle && (
              <a href={`https://youtube.com/@${instructor.youtubeHandle}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors">
                <Youtube className="w-4 h-4 text-red-400" />
              </a>
            )}
          </div>
        )}

        {/* Specializations */}
        <div className="flex flex-wrap gap-2">
          {instructor.specializations.map((spec, specIndex) => (
            <span 
              key={specIndex}
              className="px-2 py-1 bg-white/10 rounded-lg text-xs text-slate-300"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{instructor.coursesTeaching}</div>
            <div className="text-slate-300 text-xs">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{instructor.totalStudents}</div>
            <div className="text-slate-300 text-xs">Students</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-yellow-400 mb-1">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-white font-bold">{instructor.averageRating}</span>
            </div>
            <div className="text-slate-300 text-xs">Rating</div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </button>
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>Message</span>
          </button>
        </div>
        
        {/* Additional Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>
          <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading instructors...</p>
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
                Instructors Management
              </h1>
              <p className="text-slate-300 mt-1">
                Manage and monitor your institute's teaching staff
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Advanced Filter</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Awards</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Instructor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Instructors</p>
                <p className="text-3xl font-bold text-white">{instructors.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Active Instructors</p>
                <p className="text-3xl font-bold text-white">{instructors.filter(i => i.status === 'active').length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Avg. Rating</p>
                <p className="text-3xl font-bold text-white">
                  {instructors.length > 0 ? (instructors.reduce((acc, i) => acc + i.averageRating, 0) / instructors.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">
                  {instructors.reduce((acc, i) => acc + i.totalStudents, 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedInstructors.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{selectedInstructors.length} selected</span>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                    Bulk Actions
                  </button>
                </div>
              )}
              
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInstructors.map((instructor, index) => (
            <InstructorCard key={instructor.instructorId} instructor={instructor} index={index} />
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No instructors found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default InstructorsManagement;