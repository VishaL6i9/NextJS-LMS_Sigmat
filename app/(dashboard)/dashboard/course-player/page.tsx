'use client';
import React, { Suspense } from 'react';
import CoursePlayerContent from './CoursePlayerContent';

function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading course player...</div>}>
        <CoursePlayerContent />
      </Suspense>
    </div>
  );
}

export default Page;