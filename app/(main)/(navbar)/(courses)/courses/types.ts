
export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'assignment';
}

export interface Module {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

export interface CourseData {
    id?: string;
    courseName: string;
    courseCode: string;
    courseDescription: string;
    courseCategory: string;
    courseDuration: number;
    courseMode: string;
    maxEnrollments: number;
    courseFee: number;
    language: string;
    enrolledStudents?: number;
    totalAssignments?: number;
    completedAssignments?: number;
    averageGrade?: number;
    status?: 'active' | 'draft' | 'archived';
    startDate?: Date;
    endDate?: Date;
    thumbnail?: string;
    modules?: Module[];
    instructors?: { instructorId: number }[];
}
