
import { AnimatePresence } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { CourseData } from "./types";
import { CoursePurchase } from "@/app/components/services/api";

interface CourseCardListProps {
    courses: CourseData[];
    onView: (courseCode: string) => void;
    onPurchase?: (course: CourseData) => void;
    currentUserId?: string | null;
    userPurchases: CoursePurchase[];
}

export function CourseCardList({ courses, onView, onPurchase, currentUserId, userPurchases }: CourseCardListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
                {courses.map((course) => {
                    const isPurchased = userPurchases.some(purchase => 
                        purchase.courseId.toString() === course.id && 
                        purchase.status === 'COMPLETED'
                    );
                    return (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onView={onView} 
                            onPurchase={onPurchase}
                            currentUserId={currentUserId}
                            isPurchased={isPurchased}
                        />
                    )
                })}
            </AnimatePresence>
        </div>
    );
}
