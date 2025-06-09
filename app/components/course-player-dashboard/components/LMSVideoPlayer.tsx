import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { CourseSidebar } from './CourseSidebar';
import { Course } from '../types/course';

interface LMSVideoPlayerProps {
  initialCourse: Course;
}

export const LMSVideoPlayer: React.FC<LMSVideoPlayerProps> = ({ initialCourse }) => {
  const [course, setCourse] = useState<Course>(initialCourse);

  const handleLessonSelect = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      currentLessonIndex: lessonIndex,
    }));
  };

  const handleLessonComplete = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map((lesson, index) =>
        index === lessonIndex ? { ...lesson, completed: true } : lesson
      ),
    }));
  };

  const handleLessonChange = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      currentLessonIndex: lessonIndex,
    }));
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Video Player */}
      <VideoPlayer
        course={course}
        onLessonComplete={handleLessonComplete}
        onLessonChange={handleLessonChange}
      />

      {/* Course Sidebar */}
      <CourseSidebar
        course={course}
        onLessonSelect={handleLessonSelect}
      />
    </div>
  );
};