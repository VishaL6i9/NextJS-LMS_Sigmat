'use client';
import React, { useEffect, useState } from 'react';
import { CourseLearningPage } from '@/app/components/course-player-dashboard/components/CourseLearningPage';
import { getCourseById, ApiCourse } from '@/app/components/course-player-dashboard/services/api';

function Page() {
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Dynamically get courseId from URL parameters or props
        const courseId = "1"; // Placeholder for a dynamic course ID
        const fetchedCourse = await getCourseById(courseId);
        setCourse(fetchedCourse);
      } catch (err: any) {
        setError(err.message || 'Failed to load course.');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading course...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CourseLearningPage 
        course={course} 
        onBack={() => console.log('Navigate back to course list')}
      />
    </div>
  );
}

export default Page;