
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CourseData } from "./types";
import { CreditCard, Eye, Play, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseCardProps {
    course: CourseData;
    onView: (courseCode: string) => void;
    onSubscribe?: (course: CourseData) => void;
    currentUserId?: string | null;
    isSubscribed: boolean;
}

export function CourseCard({ course, onView, onSubscribe, currentUserId, isSubscribed }: CourseCardProps) {
    const router = useRouter();

    const handleViewCourse = () => {
        // Navigate to course-player with courseId as query parameter
        router.push(`/dashboard/course-player?courseId=${course.id}`);
    };
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                        {/* TODO: Replace with actual course images */}
                        <Image
                            src={course.thumbnail || "http://via.placeholder.com/400x200"}
                            alt={course.courseName}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{course.courseCategory}</Badge>
                    <CardTitle className="text-lg font-bold leading-tight">{course.courseName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                        {course.courseDescription || "No description available."}
                    </p>
                </CardContent>
                <CardFooter className="p-4">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2 w-full">
                            {isSubscribed ? (
                                <Button
                                    onClick={handleViewCourse}
                                    className="flex-1"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    View Course
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => onView(course.courseCode)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    Details
                                </Button>
                            )}
                        </div>
                        {onSubscribe && currentUserId && !isSubscribed && (
                            <Button
                                onClick={() => onSubscribe(course)}
                                variant="secondary"
                                className="w-full"
                            >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Subscribe
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
