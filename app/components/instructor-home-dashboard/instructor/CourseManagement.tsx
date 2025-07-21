import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { Calendar1 as Calendar } from '@/components/ui/Calendar1';
import { useInstructor } from '../contexts/InstructorContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CourseManagement: React.FC = () => {
  const { state, setSelectedCourse } = useInstructor();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
  };

  const filteredCourses = state.courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl"
    >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
              <p className="text-gray-600 mt-1">Manage your courses and track performance</p>
            </div>
            <Button
              onClick={() => window.location.href = '/courses?tab=form'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Course</span>
            </Button>
          </div>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          <AnimatePresence>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={course.thumbnail || '/placeholder-course.jpg'}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1">{course.courseName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.courseCode}</p>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.courseDescription}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {course.enrolledStudents} students
                          </div>
                          <div className="flex items-center text-gray-500">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {course.totalAssignments} assignments
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar width={16} height={16} stroke="currentColor" className="mr-1" />
                            {course.startDate ? course.startDate.toLocaleDateString() : 'Not set'}
                          </div>
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {course.averageGrade ? `${course.averageGrade}% avg` : 'No ratings'}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedCourse(course.id)}
                        variant="outline"
                        className="w-full mt-4 bg-transparent border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white flex items-center justify-center gap-2"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No courses found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
  );
};

export default CourseManagement;