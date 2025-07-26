import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  MoreHorizontal, 
  User, 
  GraduationCap, 
  Clock,
  Users,
  Calendar,
  Eye,
  Download,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useInstructor } from '../contexts/InstructorContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const StudentManagement: React.FC = () => {
  const { state } = useInstructor();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const filteredStudents = state.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    const matchesCourse = selectedCourse === 'all' || student.enrolledCourses.includes(selectedCourse);
    return matchesSearch && matchesFilter && matchesCourse;
  });

  const getStudentStats = () => {
    const totalStudents = new Set(state.students.map(s => s.id)).size;
    const totalEnrollments = state.students.length;
    const recentEnrollments = state.students.filter(s => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return s.lastActive > weekAgo;
    }).length;

    return { totalStudents, totalEnrollments, recentEnrollments };
  };

  const stats = getStudentStats();

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
      return course ? course.courseName : 'Unknown Course';
    });
  };

  const exportStudentData = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Status', 'Enrolled Courses', 'Average Grade', 'Completed Assignments', 'Total Assignments'],
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.status,
        getEnrolledCoursesNames(student.enrolledCourses).join('; '),
        student.averageGrade,
        student.completedAssignments,
        student.totalAssignments
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleContactStudent = (studentEmail: string, studentName: string) => {
    toast({
      title: "Contact Student",
      description: `Opening email client to contact ${studentName}`,
    });
    window.location.href = `mailto:${studentEmail}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
            <p className="text-gray-600 mt-1">Monitor student progress and engagement</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={exportStudentData}
              variant="outline"
              className="bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
          </div>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Students</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats.totalStudents}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Enrollments</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.totalEnrollments}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Recent Activity</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.recentEnrollments}
              </div>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="detailed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              Detailed View
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students or courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-md focus:shadow-lg transition-all duration-300 rounded-lg"
                />
              </div>
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg focus:shadow-lg transition-all duration-300 text-gray-700"
            >
              <option value="all">All Courses</option>
              {state.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg focus:shadow-lg transition-all duration-300 text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <TabsContent value="overview" className="space-y-4">
            {/* Student Cards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(student.status)} border-0`}>
                          {student.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <span className="text-sm text-gray-600">Courses Enrolled:</span>
                          <span className="font-medium text-blue-600">{student.enrolledCourses.length}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <span className="text-sm text-gray-600">Average Grade:</span>
                          <span className={`font-medium ${
                            student.averageGrade >= 90 ? 'text-green-600' :
                            student.averageGrade >= 80 ? 'text-blue-600' :
                            student.averageGrade >= 70 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {student.averageGrade}%
                          </span>
                        </div>

                        <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress:</span>
                            <span className="text-sm font-medium text-purple-600">
                              {student.completedAssignments}/{student.totalAssignments}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleContactStudent(student.email, student.name)}
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          size="sm"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                          size="sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Progress
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No students found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {/* Detailed Table View */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Student</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Courses</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Grade</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Active</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student, index) => (
                      <motion.tr 
                        key={student.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hover:bg-gray-50/80 transition-colors"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {getEnrolledCoursesNames(student.enrolledCourses).map((courseName, index) => (
                              <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                {courseName}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              {student.completedAssignments}/{student.totalAssignments}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            <span className={`font-semibold ${
                              student.averageGrade >= 90 ? 'text-green-600' :
                              student.averageGrade >= 80 ? 'text-blue-600' :
                              student.averageGrade >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {student.averageGrade}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatLastActive(student.lastActive)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={`${getStatusColor(student.status)} border-0`}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleContactStudent(student.email, student.name)}
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.courses.map((course) => {
                const courseStudents = state.students.filter(s => s.enrolledCourses.includes(course.id));
                const avgGrade = courseStudents.length > 0 
                  ? courseStudents.reduce((sum, s) => sum + s.averageGrade, 0) / courseStudents.length 
                  : 0;
                const completionRate = courseStudents.length > 0
                  ? courseStudents.reduce((sum, s) => sum + (s.completedAssignments / s.totalAssignments), 0) / courseStudents.length * 100
                  : 0;

                return (
                  <Card key={course.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">{course.courseName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Students</p>
                          <p className="text-xl font-bold text-blue-600">{courseStudents.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Grade</p>
                          <p className="text-xl font-bold text-green-600">{avgGrade.toFixed(1)}%</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <p className="text-sm text-purple-600 font-medium mt-1">{completionRate.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default StudentManagement;