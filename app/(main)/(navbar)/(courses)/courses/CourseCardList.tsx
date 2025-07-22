
"use client";

import { AnimatePresence } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { CourseData } from "./types";

interface CourseCardListProps {
    courses: CourseData[];
    onView: (courseCode: string) => void;
}

export function CourseCardList({ courses, onView }: CourseCardListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} onView={onView} />
                ))}
            </AnimatePresence>
        </div>
    );
}
