'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CourseLearningPage } from '@/app/components/course-player-dashboard/components/CourseLearningPage';
import { useToast } from "@/hooks/use-toast";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    if (!courseId) {
      toast({
        title: "Course Selection Required",
        description: "Please select a course to view its content.",
        variant: "destructive",
      });
      router.push('/courses');
    }
  }, [courseId, router, toast]);

  if (!courseId) {
    return null; // Or a loading spinner, as the redirect will happen
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading course player...</div>}>
        <CourseLearningPage 
          courseId={courseId} 
          onBack={() => console.log('Navigate back to course list')}
        />
      </Suspense>
    </div>
  );
}

export default Page;