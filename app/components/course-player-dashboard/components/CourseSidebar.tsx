import React from 'react';
import { CheckCircle, Circle, Clock, User } from 'lucide-react';
import { Course } from '../types/course';
import { formatTime } from '../utils/timeUtils';

interface CourseSidebarProps {
  course: Course;
  onLessonSelect: (lessonIndex: number) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  onLessonSelect,
}) => {
  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
        <div className="flex items-center text-gray-600 mb-4">
          <User size={16} className="mr-2" />
          <span className="text-sm">{course.instructor}</span>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{completedLessons}/{course.lessons.length} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-success-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedLessons / course.lessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Course Content</h3>
        <div className="space-y-2">
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
                index === course.currentLessonIndex
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {lesson.completed ? (
                    <CheckCircle className="text-success-500\" size={20} />
                  ) : (
                    <Circle className="text-gray-400 group-hover:text-gray-600" size={20} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium mb-1 ${
                    index === course.currentLessonIndex 
                      ? 'text-primary-700' 
                      : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </h4>
                  
                  {lesson.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {lesson.description}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{formatTime(lesson.duration)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};