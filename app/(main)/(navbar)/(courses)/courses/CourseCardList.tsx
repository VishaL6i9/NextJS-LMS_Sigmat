
"use client";

import { AnimatePresence } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { CourseData } from "./types";

interface CourseCardListProps {
    courses: CourseData[];
    onView: (courseCode: string) => void;
    onSubscribe?: (course: CourseData) => void;
    currentUserId?: string | null;
}

export function CourseCardList({ courses, onView, onSubscribe, currentUserId }: CourseCardListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
                {courses.map((course) => (
                    <CourseCard 
                        key={course.id} 
                        course={course} 
                        onView={onView} 
                        onSubscribe={onSubscribe}
                        currentUserId={currentUserId}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
