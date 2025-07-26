import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  DollarSign,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { Calendar1 as Calendar } from '@/components/ui/Calendar1';
import { useInstructor } from '../contexts/InstructorContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCourseRevenue,
  getCoursePurchaseAnalytics,
  deleteCourse as apiDeleteCourse
} from '@/app/components/services/api';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CourseAnalytics {
  courseId: string;
  revenue: number;
  enrollments: number;
  purchases: number;
}

const CourseManagement: React.FC = () => {
  const { state, setSelectedCourse, deleteCourse, refreshAllData } = useInstructor();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [courseAnalytics, setCourseAnalytics] = useState<Record<string, CourseAnalytics>>({});
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('grid');
  const { toast } = useToast();
  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
  };

  // Fetch analytics for all courses
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (state.courses.length === 0) return;

      setIsLoadingAnalytics(true);
      const analytics: Record<string, CourseAnalytics> = {};

      for (const course of state.courses) {
        try {
          const [revenue, purchases] = await Promise.all([
            getCourseRevenue(course.id),
            getCoursePurchaseAnalytics(course.id)
          ]);

          analytics[course.id] = {
            courseId: course.id,
            revenue: revenue.totalRevenue,
            enrollments: revenue.totalEnrollments,
            purchases: purchases.length
          };
        } catch (error) {
          console.warn(`Failed to fetch analytics for course ${course.id}:`, error);
          analytics[course.id] = {
            courseId: course.id,
            revenue: 0,
            enrollments: course.enrolledStudents,
            purchases: 0
          };
        }
      }

      setCourseAnalytics(analytics);
      setIsLoadingAnalytics(false);
    };

    fetchAnalytics();
  }, [state.courses]);

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

  const handleViewCourse = (courseId: string) => {
    router.push(`/dashboard/course-player?courseId=${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/courses?edit=${courseId}`);
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      try {
        await apiDeleteCourse(courseId);
        deleteCourse(courseId);
        await refreshAllData();
        toast({
          title: "Course Deleted",
          description: `${courseName} has been successfully deleted.`,
        });
      } catch (error: any) {
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete course.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewAnalytics = async (courseId: string) => {
    try {
      const analytics = await getCoursePurchaseAnalytics(courseId);
      toast({
        title: "Analytics",
        description: `Found ${analytics.length} purchase records for this course.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course analytics.",
        variant: "destructive",
      });
    }
  };

  const exportCourseData = () => {
    const csvContent = [
      ['Course Name', 'Course Code', 'Students', 'Revenue', 'Status', 'Average Grade'],
      ...filteredCourses.map(course => [
        course.courseName,
        course.courseCode,
        course.enrolledStudents,
        courseAnalytics[course.id]?.revenue || 0,
        course.status,
        course.averageGrade || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <div className="flex gap-3">
            <Button
              onClick={exportCourseData}
              variant="outline"
              className="bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => window.location.href = '/courses?tab=form'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Course</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl">
            <TabsTrigger
              value="grid"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              Grid View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg px-6 py-2"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white/80 backdrop-blur-sm border-0 shadow-md focus:shadow-lg transition-all duration-300 rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg focus:shadow-lg transition-all duration-300 text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <TabsContent value="grid" className="space-y-6">
            {/* Course Grid */}
            <AnimatePresence>
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.02 }}
                      className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="h-32 overflow-hidden">
                        <img
                          src={course.thumbnail || '/placeholder-course.jpg'}
                          alt={course.courseName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getStatusColor(course.status)} border-0`}>
                            {course.status}
                          </Badge>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditCourse(course.id)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id, course.courseName)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{course.courseCode}</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.courseDescription}</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <div className="flex items-center text-blue-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{course.enrolledStudents} students</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">
                                ₹{courseAnalytics[course.id]?.revenue?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {course.totalAssignments} assignments
                            </div>
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {course.averageGrade ? `${course.averageGrade}% avg` : 'No ratings'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleViewCourse(course.id)}
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                            size="sm"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleViewAnalytics(course.id)}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                            size="sm"
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                        </div>
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
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {/* List View */}
            <div className="space-y-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={course.thumbnail || '/placeholder-course.jpg'}
                        alt={course.courseName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">{course.courseName}</h3>
                        <Badge className={`${getStatusColor(course.status)} border-0`}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.courseCode}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrolledStudents} students
                        </span>
                        <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ₹{courseAnalytics[course.id]?.revenue?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {course.averageGrade || 0}% avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => handleViewCourse(course.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">{course.courseName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{courseAnalytics[course.id]?.revenue?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Students</p>
                        <p className="text-xl font-bold text-blue-600">{course.enrolledStudents}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Purchases</p>
                        <p className="text-xl font-bold text-purple-600">
                          {courseAnalytics[course.id]?.purchases || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-xl font-bold text-yellow-600">{course.averageGrade || 0}%</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => handleViewAnalytics(course.id)}
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default CourseManagement;