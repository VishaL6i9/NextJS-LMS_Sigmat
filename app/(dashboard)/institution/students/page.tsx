'use client';

import React, { useState, useEffect } from 'react';
import {  
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
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Users } from '@/components/ui/Users';
import { Download } from '@/components/ui/Download';
import { 
  getInstituteByAdminId, 
  getInstituteStudents,
  addStudentToInstitute,
  removeStudentFromInstitute,
  getUserId,
  InstituteDTO,
  UserDTO
} from '@/app/components/services/api';

interface StudentWithProgress extends UserDTO {
  enrolledCourses: number;
  completedCourses: number;
  progressPercentage: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

const StudentsManagement = () => {
  const [institute, setInstitute] = useState<InstituteDTO | null>(null);
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadStudentsData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterStatus]);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const instituteData = await getInstituteByAdminId(parseInt(userId));
      setInstitute(instituteData);

      const studentsData = await getInstituteStudents(instituteData.instituteId);
      
      // Mock additional data for demonstration
      const studentsWithProgress: StudentWithProgress[] = studentsData.map((student, index) => ({
        ...student,
        enrolledCourses: Math.floor(Math.random() * 8) + 1,
        completedCourses: Math.floor(Math.random() * 5),
        progressPercentage: Math.floor(Math.random() * 100),
        lastActive: `${Math.floor(Math.random() * 7) + 1} days ago`,
        status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'suspended'
      }));

      setStudents(studentsWithProgress);
    } catch (error) {
      console.error('Failed to load students data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'inactive': return 'from-yellow-500 to-orange-500';
      case 'suspended': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const StudentCard = ({ student, index }: { student: StudentWithProgress; index: number }) => (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedStudents.includes(student.id)}
            onChange={() => handleSelectStudent(student.id)}
            className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
          />
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
            {student.firstName[0]}{student.lastName[0]}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(student.status)} text-white text-xs font-medium flex items-center space-x-1`}>
            {getStatusIcon(student.status)}
            <span className="capitalize">{student.status}</span>
          </div>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{student.firstName} {student.lastName}</h3>
          <p className="text-slate-300 text-sm">@{student.username}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-slate-300 text-sm">
            <Mail className="w-4 h-4 mr-2" />
            {student.email}
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Last active: {student.lastActive}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{student.enrolledCourses}</div>
            <div className="text-slate-300 text-xs">Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{student.completedCourses}</div>
            <div className="text-slate-300 text-xs">Completed</div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Progress</span>
            <span className="text-white text-sm font-medium">{student.progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${student.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1">
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
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
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
          <p className="text-white text-lg">Loading students...</p>
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
                Students Management
              </h1>
              <p className="text-slate-300 mt-1">
                Manage and monitor your institute's students
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Advanced Filter</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Student</span>
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
                <p className="text-slate-300 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">{students.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Active Students</p>
                <p className="text-3xl font-bold text-white">{students.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Avg. Progress</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round(students.reduce((acc, s) => acc + s.progressPercentage, 0) / students.length)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Completions</p>
                <p className="text-3xl font-bold text-white">
                  {students.reduce((acc, s) => acc + s.completedCourses, 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
                <Award className="w-6 h-6 text-white" />
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
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedStudents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{selectedStudents.length} selected</span>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                    Bulk Actions
                  </button>
                </div>
              )}
              
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
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

export default StudentsManagement;