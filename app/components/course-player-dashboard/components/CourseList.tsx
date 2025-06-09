import React from 'react';
import { Clock, Star, Users, Award } from 'lucide-react';
import { Course } from '../types/course';
import { formatTime } from '../utils/timeUtils';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  onCourseSelect: (course: Course) => void;
  onRetry?: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  loading,
  error,
  onCourseSelect,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Courses</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
          <p className="text-gray-600">Check back later for new courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => onCourseSelect(course)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
        >
          {/* Course Header */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {course.title}
              </h3>
              {course.certificate && (
                <Award size={20} className="text-primary-500 flex-shrink-0 ml-2" />
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="font-medium">{course.instructor}</span>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star size={14} className="mr-1 text-yellow-500 fill-current" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="mr-1" />
                <span>{course.studentsEnrolled.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-1" />
                <span>{formatTime(course.duration)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{course.totalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.totalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Course Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{course.category}</span>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Continue Learning →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};