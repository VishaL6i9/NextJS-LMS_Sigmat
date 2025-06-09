import React from 'react';
import { ArrowLeft, Star, Users, Clock, Award, BookOpen } from 'lucide-react';
import { Course } from '../types/course';
import { formatTime } from '../utils/timeUtils';

interface CourseHeaderProps {
  course: Course;
  onBack?: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course, onBack }) => {
  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / course.lessons.length) * 100;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to courses"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <BookOpen size={16} />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{course.studentsEnrolled.toLocaleString()} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{formatTime(course.duration)} total</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
              {course.certificate && (
                <div className="flex items-center space-x-1">
                  <Award size={16} className="text-primary-500" />
                  <span>Certificate</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">
            Progress: {completedLessons}/{course.lessons.length} lessons
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>
      </div>
    </div>
  );
};