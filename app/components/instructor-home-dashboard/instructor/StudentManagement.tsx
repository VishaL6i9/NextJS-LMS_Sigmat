import React, { useState } from 'react';
import { Search, Filter, Mail, MoreHorizontal, User, GraduationCap, Clock } from 'lucide-react';
import { useInstructor } from '../contexts/InstructorContext';

const StudentManagement: React.FC = () => {
  const { state } = useInstructor();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  const filteredStudents = state.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatLastActive = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const getEnrolledCoursesNames = (courseIds: string[]) => {
    return courseIds.map(id => {
      const course = state.courses.find(c => c.id === id);
      return course ? course.title : 'Unknown Course';
    });
  };

  return (
    <div className="w-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
          <p className="text-gray-600 text-sm mt-1">Monitor student progress and engagement</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Mail className="w-4 h-4" />
          <span>Send Message</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Courses</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {getEnrolledCoursesNames(student.enrolledCourses).map((courseName, index) => (
                      <span key={index} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full mr-1">
                        {courseName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {student.completedAssignments}/{student.totalAssignments}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${
                      student.averageGrade >= 90 ? 'text-green-600' :
                      student.averageGrade >= 80 ? 'text-blue-600' :
                      student.averageGrade >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.averageGrade}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatLastActive(student.lastActive)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No students found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;