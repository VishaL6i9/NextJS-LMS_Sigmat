'use client';
import React from 'react';
import { InstructorProvider } from '@/app/components/instructor-home-dashboard/contexts/InstructorContext';
import InstructorHeader from '@/app/components/instructor-home-dashboard/instructor/InstructorHeader';
import InstructorDashboard from '@/app/components/instructor-home-dashboard/instructor/InstructorDashboard';
import CourseManagement from '@/app/components/instructor-home-dashboard/instructor/CourseManagement';
import StudentManagement from '@/app/components/instructor-home-dashboard/instructor/StudentManagement';

function App() {
    return (
        <InstructorProvider>
            <div className="min-h-screen bg-gray-50">
                <InstructorHeader />
                <main className="pb-8">
                    <InstructorDashboard />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                        <CourseManagement />
                        <StudentManagement />
                    </div>
                </main>
            </div>
        </InstructorProvider>
    );
}

export default App;