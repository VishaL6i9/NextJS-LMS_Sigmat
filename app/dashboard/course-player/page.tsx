'use client';
import React from 'react';
import { CourseLearningPage } from '@/app/components/course-player-dashboard/components/CourseLearningPage';
import { sampleCourse } from '@/app/components/course-player-dashboard/data/courseData';

function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <CourseLearningPage 
        course={sampleCourse} 
        onBack={() => console.log('Navigate back to course list')}
      />
    </div>
  );
}

export default Page;