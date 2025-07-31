"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  BookOpen, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { StudentProgressDTO } from "@/app/components/services/api";

interface StudentProgressCardProps {
  progress: StudentProgressDTO;
  onViewDetails?: (studentId: number) => void;
  className?: string;
}

export function StudentProgressCard({ 
  progress, 
  onViewDetails,
  className 
}: StudentProgressCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors flex items-center gap-2">
            <User className="h-5 w-5 text-slate-400" />
            {progress.studentName}
          </h3>
          <p className="text-slate-300 text-sm">
            {progress.rollNumber && `Roll: ${progress.rollNumber} • `}
            {progress.batchName}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            progress.overallGrade >= 90 ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            progress.overallGrade >= 80 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            progress.overallGrade >= 70 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
            'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {progress.gradeLevel}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Overall Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Overall Grade</span>
              <span className={`font-semibold ${
                progress.overallGrade >= 90 ? 'text-green-300' :
                progress.overallGrade >= 80 ? 'text-blue-300' :
                progress.overallGrade >= 70 ? 'text-yellow-300' :
                'text-red-300'
              }`}>
                {progress.overallGrade.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.overallGrade}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Attendance</span>
              <span className={`font-semibold ${
                progress.attendancePercentage >= 90 ? 'text-green-300' :
                progress.attendancePercentage >= 80 ? 'text-yellow-300' :
                'text-red-300'
              }`}>
                {progress.attendancePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-400">Course Progress</h4>
          {progress.courseProgress.slice(0, 2).map((course) => (
            <div key={course.courseId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3 w-3 text-slate-400" />
                  <span className="font-medium truncate text-slate-300">{course.courseName}</span>
                </div>
                <span className="text-slate-400">
                  {course.completedLessons}/{course.totalLessons}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white/20 rounded-full h-1.5 flex-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 min-w-[40px]">
                  {course.progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
          {progress.courseProgress.length > 2 && (
            <div className="text-xs text-slate-400">
              +{progress.courseProgress.length - 2} more courses
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-400">Recent Submissions</h4>
          {progress.recentSubmissions.slice(0, 2).map((submission) => (
            <div key={submission.assignmentId} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-2">
                {submission.status === 'GRADED' ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : submission.status === 'LATE' ? (
                  <AlertCircle className="h-3 w-3 text-red-400" />
                ) : (
                  <Clock className="h-3 w-3 text-yellow-400" />
                )}
                <div>
                  <div className="text-xs font-medium truncate max-w-[120px] text-slate-300">
                    {submission.assignmentTitle}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(submission.submittedAt)}
                  </div>
                </div>
              </div>
              {submission.status === 'GRADED' && (
                <span className="px-2 py-1 text-xs bg-white/20 text-slate-300 rounded-full">
                  {submission.score}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{progress.attendedClasses}</div>
            <div className="text-xs text-slate-400">Classes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{progress.recentSubmissions.length}</div>
            <div className="text-xs text-slate-400">Submissions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{progress.courseProgress.length}</div>
            <div className="text-xs text-slate-400">Courses</div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onViewDetails?.(progress.studentId)}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-4 rounded-xl transition-colors text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}