
import { AnimatePresence } from "framer-motion";
import { CourseCard } from "./CourseCard";
import { CourseData } from "./types";
import { UserSubscription } from "@/app/components/services/api";

interface CourseCardListProps {
    courses: CourseData[];
    onView: (courseCode: string) => void;
    onSubscribe?: (course: CourseData) => void;
    currentUserId?: string | null;
    userSubscriptions: UserSubscription[];
}

export function CourseCardList({ courses, onView, onSubscribe, currentUserId, userSubscriptions }: CourseCardListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
                {courses.map((course) => {
                    const isSubscribed = userSubscriptions.some(sub => sub.courseId?.toString() === course.id && sub.status === 'ACTIVE');
                    return (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onView={onView} 
                            onSubscribe={onSubscribe}
                            currentUserId={currentUserId}
                            isSubscribed={isSubscribed}
                        />
                    )
                })}
            </AnimatePresence>
        </div>
    );
}
