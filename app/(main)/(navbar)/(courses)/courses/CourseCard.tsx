
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CourseData } from "./types";
import { CreditCard, Eye, Play, Info, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseCardProps {
    course: CourseData;
    onView: (courseCodeOrId: string) => void;
    onPurchase?: (course: CourseData) => void;
    currentUserId?: string | null;
    isPurchased: boolean;
}

export function CourseCard({ course, onView, onPurchase, currentUserId, isPurchased }: CourseCardProps) {
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
                        {isPurchased && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="default" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Purchased
                                </Badge>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">{course.courseCategory}</Badge>
                        <Badge variant="outline" className="font-semibold">
                            ₹{course.courseFee}
                        </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold leading-tight">{course.courseName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                        {course.courseDescription || "No description available."}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{course.language}</Badge>
                        <Badge variant="outline" className="text-xs">{course.courseDuration}h</Badge>
                    </div>
                </CardContent>
                <CardFooter className="p-4">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2 w-full">
                            {isPurchased ? (
                                <Button
                                    onClick={handleViewCourse}
                                    className="flex-1"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    View Course
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        const identifier = course.courseCode?.trim() || course.id || '';
                                        onView(identifier);
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    Details
                                </Button>
                            )}
                        </div>
                        {onPurchase && currentUserId && !isPurchased && (
                            <Button
                                onClick={() => onPurchase(course)}
                                variant="default"
                                className="w-full"
                            >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Purchase - ₹{course.courseFee}
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
