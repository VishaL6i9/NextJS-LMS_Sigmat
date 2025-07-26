'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search,
  Mail,
  Calendar,
  GraduationCap,
  Eye
} from "lucide-react";
import {
  getUserEnrollments,
  getAllCourses,
  ApiEnrollment
} from "@/app/components/services/api";
import { useToast } from "@/hooks/use-toast";

interface StudentEnrollment extends ApiEnrollment {
  courseName: string;
}

interface StudentManagementProps {
  instructorId: string;
  courses: Array<{
    id: string;
    courseName: string;
    courseCode: string;
    studentsEnrolled: number;
  }>;
}

export function StudentManagement({ instructorId, courses }: StudentManagementProps) {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<StudentEnrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentEnrollments();
  }, [instructorId]);

  useEffect(() => {
    filterEnrollments();
  }, [searchTerm, selectedCourse, enrollments]);

  const fetchStudentEnrollments = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll get all enrollments and filter by instructor
      // In a real scenario, you'd have an API endpoint to get enrollments by instructor
      const allCourses = await getAllCourses();
      const allEnrollments: StudentEnrollment[] = [];
      
      // This is a simplified approach - you might want to create a specific API endpoint
      // for getting all enrollments for an instructor's courses
      for (const course of courses) {
        try {
          // Note: This is a workaround since we don't have a direct API for course enrollments
          // You might want to create an API endpoint like: /api/courses/{courseId}/enrollments
          const courseEnrollments = await getUserEnrollments(instructorId);
          
          const courseSpecificEnrollments = courseEnrollments
            .filter(enrollment => enrollment.courseId.toString() === course.id)
            .map(enrollment => ({
              ...enrollment,
              courseName: course.courseName
            }));
            
          allEnrollments.push(...courseSpecificEnrollments);
        } catch (error) {
          console.error(`Failed to fetch enrollments for course ${course.id}:`, error);
        }
      }
      
      setEnrollments(allEnrollments);
      
    } catch (error) {
      console.error('Failed to fetch student enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load student enrollments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(enrollment =>
        enrollment.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(enrollment => 
        enrollment.courseId.toString() === selectedCourse
      );
    }

    setFilteredEnrollments(filtered);
  };

  const getStudentStats = () => {
    const totalStudents = new Set(enrollments.map(e => e.userId)).size;
    const totalEnrollments = enrollments.length;
    const recentEnrollments = enrollments.filter(e => {
      const enrollmentDate = new Date(e.enrollmentDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return enrollmentDate > weekAgo;
    }).length;

    return { totalStudents, totalEnrollments, recentEnrollments };
  };

  const stats = getStudentStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-gray-700">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Students</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
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
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
              {stats.totalEnrollments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Recent Enrollments</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
              {stats.recentEnrollments}
            </div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
            Student Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Enrollments List */}
          <div className="space-y-4">
            {filteredEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No enrollments found matching your criteria.</p>
              </div>
            ) : (
              filteredEnrollments.map((enrollment, index) => (
                <div 
                  key={`${enrollment.userId}-${enrollment.courseId}`} 
                  className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Student ID: {enrollment.userId}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Enrolled in: <span className="font-medium text-indigo-600">{enrollment.courseName}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Enrollment Date
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Progress
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}