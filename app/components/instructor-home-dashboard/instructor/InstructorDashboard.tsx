import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Calendar,
  BarChart3,
  FileText,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Search,
  RefreshCw
} from 'lucide-react';
import { useInstructor } from '../contexts/InstructorContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast, useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

const InstructorDashboard: React.FC = () => {
  const { state } = useInstructor();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      toast({
        title: "Invalid Session",
        description: "Please Login Before Proceeding.",
        variant: "default",
      });
    }
  }, [router]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText className="w-4 h-4" />;
      case 'enrollment':
        return <Users className="w-4 h-4" />;
      case 'grade':
        return <Award className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission':
        return 'bg-blue-100 text-blue-600';
      case 'enrollment':
        return 'bg-green-100 text-green-600';
      case 'grade':
        return 'bg-yellow-100 text-yellow-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-green-500';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const upcomingDeadlines = state.assignments
    .filter(assignment => assignment.dueDate > new Date())
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const filteredCourses = state.courses.filter(course =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Full-width header section */}
      <div className="w-full py-12 px-6 lg:px-12 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-[2000px] mx-auto">
          {/* Welcome Section */}
          <motion.div className="mb-8" variants={fadeInUp} initial="initial" animate="animate">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, Dr. Wilson
              </h1>
              <p className="text-xl text-gray-600">Here's what's happening with your courses today</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 bg-transparent border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses by course name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Content with padding */}
      <div className="w-full max-w-[2000px] mx-auto px-6 lg:px-12 py-8">
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <div className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{state.stats.totalStudents}</div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+{state.stats.monthlyGrowth}%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{state.stats.activeCourses}</div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">Currently teaching</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-500">
                    <ClipboardList className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{state.stats.pendingGrades}</div>
                <div className="flex items-center mt-4 text-sm">
                  <Clock className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-orange-600 font-medium">Needs attention</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{state.stats.averageGrade}%</div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">Across all courses</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Overview */}
          <motion.div className="lg:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
            <div className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Course Overview</h2>
                  <Button variant="outline" className="bg-transparent border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white">
                    View All
                  </Button>
                </div>
                <AnimatePresence>
                  {filteredCourses.length > 0 ? (
                    <div className="space-y-4">
                      {filteredCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-500/10 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <img
                              src={course.thumbnail}
                              alt={course.courseName || 'Course thumbnail'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900 truncate">{course.courseName}</h3>
                              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                {course.courseCode}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{course.enrolledStudents} students enrolled</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <ClipboardList className="w-3 h-3 mr-1" />
                                {course.completedAssignments}/{course.totalAssignments} assignments
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                {course.averageGrade}% avg
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-lg font-bold text-indigo-700">{course.averageGrade}%</span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
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
                      <p className="text-gray-500 mt-2">Try adjusting your search query</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div className="space-y-8" variants={fadeInUp} initial="initial" animate="animate">
            <div className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {state.recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ scale: 1.02 }}
                      className={`border-l-4 pl-4 py-2 ${getPriorityColor(activity.priority)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} shadow-sm`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                            {activity.courseName && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {activity.courseName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Deadlines */}
        <motion.div
          className="mt-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Assignment Deadlines</h2>
                <Button variant="outline" className="bg-transparent border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white">
                  View Calendar
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingDeadlines.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gray-500/5 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{assignment.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${assignment.type === 'project' ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white' :
                        assignment.type === 'quiz' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' :
                          assignment.type === 'exam' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
                            'bg-gradient-to-r from-gray-500 to-slate-600 text-white'
                        }`}>
                        {assignment.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.courseName}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {assignment.dueDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{assignment.submissions}/{assignment.totalPoints}</span>
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorDashboard;