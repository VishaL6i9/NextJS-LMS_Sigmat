
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CourseData } from "./types";

interface CourseCardProps {
    course: CourseData;
    onView: (courseCode: string) => void;
}

export function CourseCard({ course, onView }: CourseCardProps) {
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
                    <Button onClick={() => onView(course.courseCode)} className="w-full">
                        View Course
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
