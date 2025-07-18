'use client';
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Course, Student, Assignment, InstructorStats, RecentActivity, Instructor } from '../types/instructor';
import { apiService, createCourse as apiCreateCourse, updateCourse as apiUpdateCourse, getAllCourses as apiGetAllCourses, ApiCourseRequest } from '@/app/components/services/api';

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
    | { type: 'UPDATE_STATS' }
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
            dispatch({ type: 'SET_COURSES', payload: courses.map(c => ({
                id: c.id,
                courseName: c.courseName,
                courseCode: c.courseCode,
                courseDescription: c.courseDescription,
                courseDuration: c.courseDuration,
                courseMode: c.courseMode,
                maxEnrollments: c.maxEnrollments,
                courseFee: c.courseFee,
                language: c.language,
                courseCategory: c.courseCategory,
                instructors: c.instructors.map(inst => ({
                    instructorId: inst.instructorId,
                    firstName: inst.firstName,
                    lastName: inst.lastName,
                    email: inst.email,
                    phoneNo: inst.phoneNo,
                    dateOfJoining: inst.dateOfJoining
                })),
                enrolledStudents: c.studentsEnrolled,
                totalAssignments: 0, // Assuming this will be fetched or calculated elsewhere
                completedAssignments: 0, // Assuming this will be fetched or calculated elsewhere
                averageGrade: c.rating,
                status: 'active', // Assuming all fetched courses are active for now
                startDate: new Date(c.createdAt), // Using createdAt as startDate for now
                endDate: new Date(c.updatedAt), // Using updatedAt as endDate for now
                thumbnail: '' // Placeholder, needs to be added to API or derived
            }))});
        } catch (err: any) {
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
            dispatch({ type: 'ADD_COURSE', payload: {
                id: newCourse.id,
                courseName: newCourse.courseName,
                courseCode: newCourse.courseCode,
                courseDescription: newCourse.courseDescription,
                courseDuration: newCourse.courseDuration,
                courseMode: newCourse.courseMode,
                maxEnrollments: newCourse.maxEnrollments,
                courseFee: newCourse.courseFee,
                language: newCourse.language,
                courseCategory: newCourse.courseCategory,
                instructors: newCourse.instructors.map(inst => ({
                    instructorId: inst.instructorId,
                    firstName: inst.firstName,
                    lastName: inst.lastName,
                    email: inst.email,
                    phoneNo: inst.phoneNo,
                    dateOfJoining: inst.dateOfJoining
                })),
                enrolledStudents: newCourse.studentsEnrolled,
                totalAssignments: 0,
                completedAssignments: 0,
                averageGrade: newCourse.rating,
                status: 'active',
                startDate: new Date(newCourse.createdAt),
                endDate: new Date(newCourse.updatedAt),
                thumbnail: ''
            } });
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
            dispatch({ type: 'UPDATE_COURSE', payload: {
                id: updatedCourse.id,
                courseName: updatedCourse.courseName,
                courseCode: updatedCourse.courseCode,
                courseDescription: updatedCourse.courseDescription,
                courseDuration: updatedCourse.courseDuration,
                courseMode: updatedCourse.courseMode,
                maxEnrollments: updatedCourse.maxEnrollments,
                courseFee: updatedCourse.courseFee,
                language: updatedCourse.language,
                courseCategory: updatedCourse.courseCategory,
                instructors: updatedCourse.instructors.map(inst => ({
                    instructorId: inst.instructorId,
                    firstName: inst.firstName,
                    lastName: inst.lastName,
                    email: inst.email,
                    phoneNo: inst.phoneNo,
                    dateOfJoining: inst.dateOfJoining
                })),
                enrolledStudents: updatedCourse.studentsEnrolled,
                totalAssignments: 0,
                completedAssignments: 0,
                averageGrade: updatedCourse.rating,
                status: 'active',
                startDate: new Date(updatedCourse.createdAt),
                endDate: new Date(updatedCourse.updatedAt),
                thumbnail: ''
            } });
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

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const value: InstructorContextType = {
        state,
        setSelectedCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        fetchCourses
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