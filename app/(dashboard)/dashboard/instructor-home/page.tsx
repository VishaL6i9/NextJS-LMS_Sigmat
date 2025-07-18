'use client';
import React from 'react';
import { InstructorProvider } from '@/app/components/instructor-home-dashboard/contexts/InstructorContext';
import InstructorHeader from '@/app/components/instructor-home-dashboard/instructor/InstructorHeader';
import InstructorDashboard from '@/app/components/instructor-home-dashboard/instructor/InstructorDashboard';
import CourseManagement from '@/app/components/instructor-home-dashboard/instructor/CourseManagement';
import StudentManagement from '@/app/components/instructor-home-dashboard/instructor/StudentManagement';
import { NotificationProvider } from '@/app/components/instructor-home-dashboard/contexts/NotificationContext';

function App() {
    return (
        <InstructorProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen">
                    <InstructorHeader />
                </div>
                <main className="pb-12">
                    <NotificationProvider>
                        
                        <InstructorDashboard />
                    </NotificationProvider>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen mt-8 space-y-8">
                        <CourseManagement />
                        <StudentManagement />
                    </div>
                </main>
            </div>
        </InstructorProvider>
    );
}

export default App;