'use client';
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Course, Student, Assignment, InstructorStats, RecentActivity, Instructor } from '../types/instructor';
import {
    apiService,
    createCourse as apiCreateCourse,
    updateCourse as apiUpdateCourse,
    getAllCourses as apiGetAllCourses,
    ApiCourseRequest,
    getUserEnrollments,
    getCourseRevenue,
    getCoursePurchaseAnalytics,
    getUserId,
    getUserRoles,
    getAllInstructors
} from '@/app/components/services/api';

interface InstructorState {
    courses: Course[];
    students: Student[];
    assignments: Assignment[];
    stats: InstructorStats;
    recentActivity: RecentActivity[];
    selectedCourse: string | null;
    loading: boolean;
    error: string | null;
}

type InstructorAction =
    | { type: 'SET_SELECTED_COURSE'; payload: string | null }
    | { type: 'ADD_COURSE'; payload: Course }
    | { type: 'UPDATE_COURSE'; payload: Course }
    | { type: 'DELETE_COURSE'; payload: string }
    | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
    | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
    | { type: 'DELETE_ASSIGNMENT'; payload: string }
    | { type: 'SET_STATS'; payload: InstructorStats }
    | { type: 'SET_RECENT_ACTIVITY'; payload: RecentActivity[] }
    | { type: 'SET_STUDENTS'; payload: Student[] }
    | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
    | { type: 'SET_COURSES'; payload: Course[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

interface InstructorContextType {
    state: InstructorState;
    setSelectedCourse: (courseId: string | null) => void;
    addCourse: (course: Omit<ApiCourseRequest, 'instructors'> & { instructors: { instructorId: number }[] }) => Promise<void>;
    updateCourse: (courseId: string, course: Omit<ApiCourseRequest, 'instructors'> & { instructors: { instructorId: number }[] }) => Promise<void>;
    deleteCourse: (courseId: string) => void;
    addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
    updateAssignment: (assignment: Assignment) => void;
    deleteAssignment: (assignmentId: string) => void;
    fetchCourses: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchRecentActivity: () => Promise<void>;
    fetchStudents: () => Promise<void>;
    fetchAssignments: () => Promise<void>;
    refreshAllData: () => Promise<void>;
    getCurrentInstructor: () => Promise<any>;
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

const initialState: InstructorState = {
    courses: [],
    students: [],
    assignments: [],
    stats: {
        totalStudents: 0,
        activeCourses: 0,
        pendingGrades: 0,
        totalAssignments: 0,
        averageGrade: 0,
        completionRate: 0,
        thisWeekSubmissions: 0,
        monthlyGrowth: 0
    },
    recentActivity: [],
    selectedCourse: null,
    loading: false,
    error: null
};

function instructorReducer(state: InstructorState, action: InstructorAction): InstructorState {
    switch (action.type) {
        case 'SET_SELECTED_COURSE':
            return { ...state, selectedCourse: action.payload };
        case 'ADD_COURSE':
            return {
                ...state,
                courses: [...state.courses, action.payload]
            };
        case 'UPDATE_COURSE':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.id ? action.payload : course
                )
            };
        case 'DELETE_COURSE':
            return {
                ...state,
                courses: state.courses.filter(course => course.id !== action.payload)
            };
        case 'ADD_ASSIGNMENT':
            return {
                ...state,
                assignments: [...state.assignments, { ...action.payload, id: Date.now().toString() }]
            };
        case 'UPDATE_ASSIGNMENT':
            return {
                ...state,
                assignments: state.assignments.map(assignment =>
                    assignment.id === action.payload.id ? action.payload : assignment
                )
            };
        case 'DELETE_ASSIGNMENT':
            return {
                ...state,
                assignments: state.assignments.filter(assignment => assignment.id !== action.payload)
            };
        case 'SET_STATS':
            return { ...state, stats: action.payload };
        case 'SET_RECENT_ACTIVITY':
            return { ...state, recentActivity: action.payload };
        case 'SET_STUDENTS':
            return { ...state, students: action.payload };
        case 'SET_ASSIGNMENTS':
            return { ...state, assignments: action.payload };
        case 'SET_COURSES':
            return { ...state, courses: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

export const InstructorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(instructorReducer, initialState);

    const setSelectedCourse = useCallback((courseId: string | null) => {
        dispatch({ type: 'SET_SELECTED_COURSE', payload: courseId });
    }, []);

    const fetchCourses = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const courses = await apiGetAllCourses();
            console.log('Fetched courses in InstructorContext:', courses); // Debug log
            dispatch({
                type: 'SET_COURSES', payload: courses.map(c => ({
                    id: c.courseId, // Fixed: use courseId instead of id
                    courseName: c.courseName,
                    courseCode: c.courseCode,
                    courseDescription: c.courseDescription,
                    courseDuration: c.courseDuration,
                    courseMode: c.courseMode,
                    maxEnrollments: c.maxEnrollments,
                    courseFee: c.courseFee,
                    language: c.language,
                    courseCategory: c.courseCategory,
                    instructors: c.instructors?.map(inst => ({
                        instructorId: inst.instructorId,
                        firstName: inst.firstName,
                        lastName: inst.lastName,
                        email: inst.email,
                        phoneNo: inst.phoneNo,
                        dateOfJoining: inst.dateOfJoining
                    })) || [], // Added fallback for instructors
                    enrolledStudents: c.studentsEnrolled,
                    totalAssignments: 0, // Assuming this will be fetched or calculated elsewhere
                    completedAssignments: 0, // Assuming this will be fetched or calculated elsewhere
                    averageGrade: c.rating,
                    status: 'active' as const, // Assuming all fetched courses are active for now
                    startDate: new Date(c.createdAt), // Using createdAt as startDate for now
                    endDate: new Date(c.updatedAt), // Using updatedAt as endDate for now
                    thumbnail: '' // Placeholder, needs to be added to API or derived
                }))
            });
            console.log('Mapped courses in InstructorContext:', courses.map(c => c.courseId)); // Debug log
        } catch (err: any) {
            console.error('Error fetching courses in InstructorContext:', err); // Debug log
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch courses' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const addCourse = useCallback(async (courseData: Omit<ApiCourseRequest, 'instructors'> & { instructors: { instructorId: number }[] }) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const newCourse = await apiCreateCourse(courseData);
            dispatch({
                type: 'ADD_COURSE', payload: {
                    id: newCourse.courseId, // Fixed: use courseId instead of id
                    courseName: newCourse.courseName,
                    courseCode: newCourse.courseCode,
                    courseDescription: newCourse.courseDescription,
                    courseDuration: newCourse.courseDuration,
                    courseMode: newCourse.courseMode,
                    maxEnrollments: newCourse.maxEnrollments,
                    courseFee: newCourse.courseFee,
                    language: newCourse.language,
                    courseCategory: newCourse.courseCategory,
                    instructors: newCourse.instructors?.map(inst => ({
                        instructorId: inst.instructorId,
                        firstName: inst.firstName,
                        lastName: inst.lastName,
                        email: inst.email,
                        phoneNo: inst.phoneNo,
                        dateOfJoining: inst.dateOfJoining
                    })) || [], // Added fallback for instructors
                    enrolledStudents: newCourse.studentsEnrolled,
                    totalAssignments: 0,
                    completedAssignments: 0,
                    averageGrade: newCourse.rating,
                    status: 'active' as const,
                    startDate: new Date(newCourse.createdAt),
                    endDate: new Date(newCourse.updatedAt),
                    thumbnail: ''
                }
            });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to add course' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const updateCourse = useCallback(async (courseId: string, courseData: Omit<ApiCourseRequest, 'instructors'> & { instructors: { instructorId: number }[] }) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const updatedCourse = await apiUpdateCourse(courseId, courseData);
            dispatch({
                type: 'UPDATE_COURSE', payload: {
                    id: updatedCourse.courseId, // Fixed: use courseId instead of id
                    courseName: updatedCourse.courseName,
                    courseCode: updatedCourse.courseCode,
                    courseDescription: updatedCourse.courseDescription,
                    courseDuration: updatedCourse.courseDuration,
                    courseMode: updatedCourse.courseMode,
                    maxEnrollments: updatedCourse.maxEnrollments,
                    courseFee: updatedCourse.courseFee,
                    language: updatedCourse.language,
                    courseCategory: updatedCourse.courseCategory,
                    instructors: updatedCourse.instructors?.map(inst => ({
                        instructorId: inst.instructorId,
                        firstName: inst.firstName,
                        lastName: inst.lastName,
                        email: inst.email,
                        phoneNo: inst.phoneNo,
                        dateOfJoining: inst.dateOfJoining
                    })) || [], // Added fallback for instructors
                    enrolledStudents: updatedCourse.studentsEnrolled,
                    totalAssignments: 0,
                    completedAssignments: 0,
                    averageGrade: updatedCourse.rating,
                    status: 'active' as const,
                    startDate: new Date(updatedCourse.createdAt),
                    endDate: new Date(updatedCourse.updatedAt),
                    thumbnail: ''
                }
            });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to update course' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const deleteCourse = useCallback((courseId: string) => {
        // TODO: Implement API call for deleting a course
        dispatch({ type: 'DELETE_COURSE', payload: courseId });
    }, []);

    const addAssignment = useCallback((assignment: Omit<Assignment, 'id'>) => {
        dispatch({ type: 'ADD_ASSIGNMENT', payload: assignment as Assignment });
    }, []);

    const updateAssignment = useCallback((assignment: Assignment) => {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: assignment });
    }, []);

    const deleteAssignment = useCallback((assignmentId: string) => {
        dispatch({ type: 'DELETE_ASSIGNMENT', payload: assignmentId });
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const courses = await apiGetAllCourses();
            let totalStudents = 0;
            let totalRevenue = 0;
            let totalEnrollments = 0;
            let totalRating = 0;
            let ratedCourses = 0;

            // Calculate stats from courses and revenue data
            for (const course of courses) {
                totalStudents += course.studentsEnrolled;
                if (course.rating > 0) {
                    totalRating += course.rating;
                    ratedCourses++;
                }

                try {
                    const revenue = await getCourseRevenue(course.courseId);
                    totalRevenue += revenue.totalRevenue;
                    totalEnrollments += revenue.totalEnrollments;
                } catch (error) {
                    console.warn(`Failed to fetch revenue for course ${course.courseId}:`, error);
                }
            }

            const averageGrade = ratedCourses > 0 ? totalRating / ratedCourses : 0;
            const monthlyGrowth = Math.floor(Math.random() * 15) + 5; // Mock data for now

            const stats: InstructorStats = {
                totalStudents,
                activeCourses: courses.length,
                pendingGrades: Math.floor(Math.random() * 25) + 5, // Mock data
                totalAssignments: Math.floor(Math.random() * 50) + 20, // Mock data
                averageGrade,
                completionRate: Math.floor(Math.random() * 30) + 70, // Mock data
                thisWeekSubmissions: Math.floor(Math.random() * 100) + 50, // Mock data
                monthlyGrowth
            };

            dispatch({ type: 'SET_STATS', payload: stats });
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch stats' });
        }
    }, []);

    const fetchRecentActivity = useCallback(async () => {
        try {
            const courses = await apiGetAllCourses();
            const activities: RecentActivity[] = [];

            // Generate recent activity based on course data
            for (const course of courses) {
                try {
                    const purchases = await getCoursePurchaseAnalytics(course.courseId);

                    // Add enrollment activities from recent purchases
                    purchases.slice(0, 3).forEach((purchase, index) => {
                        activities.push({
                            id: `enrollment-${course.courseId}-${index}`,
                            type: 'enrollment',
                            title: 'New Student Enrollment',
                            description: `Student enrolled in ${course.courseName}`,
                            timestamp: new Date(purchase.purchaseDate),
                            courseName: course.courseName,
                            priority: 'medium'
                        });
                    });
                } catch (error) {
                    console.warn(`Failed to fetch analytics for course ${course.courseId}:`, error);
                }

                // Add some mock assignment submissions
                if (Math.random() > 0.5) {
                    activities.push({
                        id: `submission-${course.courseId}`,
                        type: 'submission',
                        title: 'Assignment Submitted',
                        description: `New submission for ${course.courseName}`,
                        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Random time in last 7 days
                        courseName: course.courseName,
                        priority: 'high'
                    });
                }
            }

            // Sort by timestamp and take the most recent 10
            const sortedActivities = activities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 10);

            dispatch({ type: 'SET_RECENT_ACTIVITY', payload: sortedActivities });
        } catch (error: any) {
            console.error('Failed to fetch recent activity:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch recent activity' });
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        try {
            const courses = await apiGetAllCourses();
            const students: Student[] = [];

            // Generate student data based on enrollments
            for (const course of courses) {
                for (let i = 0; i < course.studentsEnrolled; i++) {
                    const studentId = `student-${course.courseId}-${i}`;
                    const existingStudent = students.find(s => s.id === studentId);

                    if (!existingStudent) {
                        students.push({
                            id: studentId,
                            name: `Student ${i + 1}`,
                            email: `student${i + 1}@example.com`,
                            enrolledCourses: [course.courseId],
                            totalAssignments: Math.floor(Math.random() * 10) + 5,
                            completedAssignments: Math.floor(Math.random() * 8) + 2,
                            averageGrade: Math.floor(Math.random() * 30) + 70,
                            lastActive: new Date(Date.now() - Math.random() * 86400000 * 30),
                            status: 'active'
                        });
                    } else {
                        existingStudent.enrolledCourses.push(course.courseId);
                    }
                }
            }

            dispatch({ type: 'SET_STUDENTS', payload: students });
        } catch (error: any) {
            console.error('Failed to fetch students:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch students' });
        }
    }, []);

    const fetchAssignments = useCallback(async () => {
        try {
            const courses = await apiGetAllCourses();
            const assignments: Assignment[] = [];

            // Generate assignment data for each course
            courses.forEach((course, courseIndex) => {
                const assignmentTypes: Array<'quiz' | 'project' | 'essay' | 'exam'> = ['quiz', 'project', 'essay', 'exam'];
                const numAssignments = Math.floor(Math.random() * 5) + 3; // 3-7 assignments per course

                for (let i = 0; i < numAssignments; i++) {
                    const type = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30); // Random date ±30 days

                    assignments.push({
                        id: `assignment-${course.courseId}-${i}`,
                        title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
                        courseId: course.courseId,
                        courseName: course.courseName,
                        description: `${type} assignment for ${course.courseName}`,
                        dueDate,
                        totalPoints: Math.floor(Math.random() * 50) + 50,
                        submissions: Math.floor(Math.random() * course.studentsEnrolled),
                        graded: Math.floor(Math.random() * course.studentsEnrolled * 0.8),
                        averageScore: Math.floor(Math.random() * 30) + 70,
                        status: Math.random() > 0.3 ? 'published' : 'draft',
                        type
                    });
                }
            });

            dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });
        } catch (error: any) {
            console.error('Failed to fetch assignments:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch assignments' });
        }
    }, []);

    const getCurrentInstructor = useCallback(async () => {
        try {
            const userId = await getUserId();
            const instructors = await getAllInstructors();
            const currentInstructor = instructors.find(inst => inst.instructorId.toString() === userId);
            return currentInstructor;
        } catch (error) {
            console.error('Failed to get current instructor:', error);
            return null;
        }
    }, []);

    const refreshAllData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await Promise.all([
                fetchCourses(),
                fetchStats(),
                fetchRecentActivity(),
                fetchStudents(),
                fetchAssignments()
            ]);
        } catch (error: any) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to refresh data' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [fetchCourses, fetchStats, fetchRecentActivity, fetchStudents, fetchAssignments]);

    useEffect(() => {
        refreshAllData();
    }, [refreshAllData]);

    const value: InstructorContextType = {
        state,
        setSelectedCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        fetchCourses,
        fetchStats,
        fetchRecentActivity,
        fetchStudents,
        fetchAssignments,
        refreshAllData,
        getCurrentInstructor
    };

    return (
        <InstructorContext.Provider value={value}>
            {children}
        </InstructorContext.Provider>
    );
};

export const useInstructor = (): InstructorContextType => {
    const context = useContext(InstructorContext);
    if (!context) {
        throw new Error('useInstructor must be used within an InstructorProvider');
    }
    return context;
};