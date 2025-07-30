"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  GraduationCap,
  BarChart3,
  Crown,
  Zap,
  Shield,
  Award,
  Target,
  RefreshCw
} from "lucide-react";
import { Users } from '@/components/ui/Users';
import { Sparkles } from '@/components/ui/Sparkles';
import { ChevronRight } from '@/components/ui/ChevronRight';
import { Download } from "@/components/ui/Download";
import {
  getCourseRevenue,
  getCoursePurchaseAnalytics,
  getAllInstructors,
  getInstructorById,
  getUserId,
  getUserRoles,
  getCoursesByUserId
} from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { StudentManagement } from "../components/StudentManagement";
import { CourseAnalytics } from "../components/CourseAnalytics";
import { InstructorProvider } from '@/app/components/instructor-home-dashboard/contexts/InstructorContext';
import { NotificationProvider } from '@/app/components/instructor-home-dashboard/contexts/NotificationContext';
import InstructorHeader from '@/app/components/instructor-home-dashboard/instructor/InstructorHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProvider } from '@/app/contexts/UserContext';

interface CourseStats {
  id: string;
  courseName: string;
  courseCode: string;
  studentsEnrolled: number;
  totalRevenue: number;
  totalEnrollments: number;
  courseFee: number;
  rating: number;
}

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

function InstructorHomepageContent() {
  const [courses, setCourses] = useState<CourseStats[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentInstructorId, setCurrentInstructorId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { toast } = useToast();
  const router = useRouter();

  // Premium Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    whileHover: {
      scale: 1.05,
      y: -8,
      transition: { duration: 0.3 }
    },
    whileTap: { scale: 0.98 }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    initializeInstructorData();
  }, []);

  const initializeInstructorData = async () => {
    console.log('initializeInstructorData: Starting...');
    try {
      setIsLoading(true);

      // Get current user info and roles
      const userId = await getUserId();
      console.log('initializeInstructorData: Fetched userId:', userId);
      const roles = await getUserRoles();
      const roleNames = roles.map(role => role.name || role.toString());
      console.log('initializeInstructorData: Fetched user roles:', roleNames);
      setUserRoles(roleNames);

      // Check if user is an instructor
      if (!roleNames.includes('INSTRUCTOR') && !roleNames.includes('ADMIN')) {
        toast({
          title: "Access Denied",
          description: "You don't have instructor permissions.",
          variant: "destructive",
        });
        router.push('/dashboard/user-home');
        console.log('initializeInstructorData: Access Denied, redirecting.');
        return;
      }

      //I fixed springboot to properly user userId to fetch instructor related courses.
      setCurrentInstructorId(userId);
      console.log('initializeInstructorData: Setting currentInstructorId:', userId);

      await fetchInstructorCourses(userId);
      console.log('initializeInstructorData: fetchInstructorCourses completed.');

    } catch (error: any) {
      console.error('initializeInstructorData: Failed to initialize instructor data:', error);
      toast({
        title: "Error",
        description: "Failed to load instructor dashboard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('initializeInstructorData: Setting isLoading to false.');
    }
  };

  const fetchInstructorCourses = async (instructorId: string) => {
    try {
      // Only Courses linked to instructor are displayed
      const allCourses = await getCoursesByUserId(instructorId);

      const courseStatsPromises = allCourses.map(async (course) => {
        try {
          const revenue = await getCourseRevenue(course.courseId);

          return {
            id: course.courseId,
            courseName: course.courseName,
            courseCode: course.courseCode,
            studentsEnrolled: course.studentsEnrolled,
            totalRevenue: revenue.totalRevenue,
            totalEnrollments: revenue.totalEnrollments,
            courseFee: course.courseFee,
            rating: course.rating
          };
        } catch (error) {
          // If revenue fetch fails, use basic course data
          return {
            id: course.courseId,
            courseName: course.courseName,
            courseCode: course.courseCode,
            studentsEnrolled: course.studentsEnrolled,
            totalRevenue: 0,
            totalEnrollments: course.studentsEnrolled,
            courseFee: course.courseFee,
            rating: course.rating
          };
        }
      });

      const courseStats = await Promise.all(courseStatsPromises);
      setCourses(courseStats);

      // Calculate dashboard stats
      const stats = courseStats.reduce((acc, course) => ({
        totalCourses: acc.totalCourses + 1,
        totalStudents: acc.totalStudents + course.studentsEnrolled,
        totalRevenue: acc.totalRevenue + course.totalRevenue,
        averageRating: acc.averageRating + course.rating
      }), { totalCourses: 0, totalStudents: 0, totalRevenue: 0, averageRating: 0 });

      stats.averageRating = stats.totalCourses > 0 ? stats.averageRating / stats.totalCourses : 0;

      setDashboardStats(stats);

    } catch (error) {
      console.error('Failed to fetch instructor courses:', error);
      toast({
        title: "Error",
        description: "Failed to load course data.",
        variant: "destructive",
      });
    }
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/dashboard/course-player?courseId=${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/courses?edit=${courseId}`);
  };

  const handleViewAnalytics = async (courseId: string) => {
    try {
      const analytics = await getCoursePurchaseAnalytics(courseId);
      // You could open a modal or navigate to analytics page
      console.log('Course analytics:', analytics);
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



  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      if (currentInstructorId) {
        await fetchInstructorCourses(currentInstructorId);
        toast({
          title: "Dashboard Refreshed",
          description: "Latest data has been loaded successfully.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportDashboardData = () => {
    const csvContent = [
      ['Course Name', 'Course Code', 'Students', 'Revenue', 'Rating'],
      ...courses.map(course => [
        course.courseName,
        course.courseCode,
        course.studentsEnrolled,
        course.totalRevenue,
        course.rating
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instructor-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-white rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent"
          >
            Loading Professional Dashboard...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-slate-600"
          >
            Preparing your instructor experience
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      

      <div className="w-full relative z-10">
        <UserProvider>
          <InstructorProvider>
        <InstructorHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </InstructorProvider>
        </UserProvider>
      
      </div>

      <main className="pb-12 relative z-10">
        {/* Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full py-16 px-6 lg:px-12 bg-gradient-to-r from-blue-600/8 via-indigo-600/8 to-slate-700/8 backdrop-blur-sm"
        >
          <div className="max-w-[2000px] mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg"
                  >
                    <Crown className="h-8 w-8 text-white" />
                  </motion.div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 px-4 py-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Professional Dashboard
                  </Badge>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 bg-clip-text text-transparent mb-4 leading-tight">
                  Instructor
                  <br />
                  <span className="text-4xl lg:text-6xl">Excellence Hub</span>
                </h1>

                <p className="text-xl text-slate-700 mb-6 max-w-2xl leading-relaxed">
                  Transform education with powerful analytics, seamless course management, and professional insights that drive student success.
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Secure & Reliable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span>Real-time Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Goal-Oriented</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-full"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>

                <Button
                  onClick={exportDashboardData}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-full"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </Button>

                <Button
                  onClick={() => router.push('/courses')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 group rounded-full"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create Course
                  <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-[2000px] mx-auto px-6 lg:px-12 mt-12">

          {/* Premium Stats Overview */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            <motion.div variants={cardVariants} {...scaleOnHover}>
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-indigo-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-600 mb-1">Total Courses</CardTitle>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                      {dashboardStats.totalCourses}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg group-hover:shadow-xl"
                  >
                    <BookOpen className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Active & Growing</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} {...scaleOnHover}>
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-teal-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-600 mb-1">Total Students</CardTitle>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent">
                      {dashboardStats.totalStudents}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg group-hover:shadow-xl"
                  >
                    <Users className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-emerald-600 font-medium">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span>Enrolled & Learning</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} {...scaleOnHover}>
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 to-orange-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-600 mb-1">Total Revenue</CardTitle>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent">
                      ₹{dashboardStats.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl shadow-lg group-hover:shadow-xl"
                  >
                    <DollarSign className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-amber-600 font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Revenue Growth</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} {...scaleOnHover}>
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-violet-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-600 mb-1">Average Rating</CardTitle>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-violet-800 bg-clip-text text-transparent">
                      {dashboardStats.averageRating.toFixed(1)}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl shadow-lg group-hover:shadow-xl"
                  >
                    <Award className="h-6 w-6 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-purple-600 font-medium">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>Excellence Rating</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>


        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-[2000px] mx-auto px-6 lg:px-12"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                    Course Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                      <Card
                        key={course.id}
                        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                              {course.courseName}
                            </CardTitle>
                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
                              {course.courseCode}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <span className="text-sm text-slate-600 flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-600" />
                              Students:
                            </span>
                            <span className="font-semibold text-blue-700">{course.studentsEnrolled}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                            <span className="text-sm text-slate-600 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-amber-600" />
                              Revenue:
                            </span>
                            <span className="font-semibold text-amber-700">₹{course.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                            <span className="text-sm text-slate-600 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1 text-purple-600" />
                              Rating:
                            </span>
                            <span className="font-semibold text-purple-700">{course.rating}/5</span>
                          </div>
                          <div className="flex gap-2 mt-4 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                              onClick={() => handleViewCourse(course.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                              onClick={() => handleViewAnalytics(course.id)}
                            >
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-800 mb-2">{course.courseName}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                              <Users className="h-4 w-4 mr-1" />
                              {course.studentsEnrolled} students
                            </span>
                            <span className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ₹{course.courseFee} fee
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                            onClick={() => handleViewCourse(course.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <StudentManagement
                instructorId={currentInstructorId || ''}
                courses={courses.map(course => ({
                  id: course.id,
                  courseName: course.courseName,
                  courseCode: course.courseCode,
                  studentsEnrolled: course.studentsEnrolled
                }))}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <CourseAnalytics
                courses={courses.map(course => ({
                  id: course.id,
                  courseName: course.courseName,
                  courseCode: course.courseCode,
                  studentsEnrolled: course.studentsEnrolled,
                  courseFee: course.courseFee,
                  rating: course.rating
                }))}
              />
            </div>
          )}
        </motion.div>
      </main>
    </div >
  );
}

export default function InstructorHomepage() {
  return (
    <InstructorProvider>
      <NotificationProvider>
        <InstructorHomepageContent />
      </NotificationProvider>
    </InstructorProvider>
  );
}