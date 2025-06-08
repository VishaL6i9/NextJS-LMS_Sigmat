'use client';
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Course, Student, Assignment, InstructorStats, RecentActivity } from '../types/instructor';

interface InstructorState {
    courses: Course[];
    students: Student[];
    assignments: Assignment[];
    stats: InstructorStats;
    recentActivity: RecentActivity[];
    selectedCourse: string | null;
}

type InstructorAction =
    | { type: 'SET_SELECTED_COURSE'; payload: string | null }
    | { type: 'ADD_COURSE'; payload: Course }
    | { type: 'UPDATE_COURSE'; payload: Course }
    | { type: 'DELETE_COURSE'; payload: string }
    | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
    | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
    | { type: 'DELETE_ASSIGNMENT'; payload: string }
    | { type: 'UPDATE_STATS' };

interface InstructorContextType {
    state: InstructorState;
    setSelectedCourse: (courseId: string | null) => void;
    addCourse: (course: Omit<Course, 'id'>) => void;
    updateCourse: (course: Course) => void;
    deleteCourse: (courseId: string) => void;
    addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
    updateAssignment: (assignment: Assignment) => void;
    deleteAssignment: (assignmentId: string) => void;
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

const initialState: InstructorState = {
    courses: [
        {
            id: '1',
            title: 'Advanced React Development',
            code: 'CS-401',
            description: 'Master advanced React patterns, hooks, and state management',
            enrolledStudents: 45,
            totalAssignments: 12,
            completedAssignments: 8,
            averageGrade: 87.5,
            status: 'active',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-05-15'),
            category: 'Programming',
            thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: '2',
            title: 'Database Design & Management',
            code: 'CS-302',
            description: 'Comprehensive database design, SQL, and NoSQL fundamentals',
            enrolledStudents: 38,
            totalAssignments: 10,
            completedAssignments: 6,
            averageGrade: 82.3,
            status: 'active',
            startDate: new Date('2024-01-20'),
            endDate: new Date('2024-05-20'),
            category: 'Database',
            thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: '3',
            title: 'Web Security Fundamentals',
            code: 'CS-450',
            description: 'Learn essential web security practices and vulnerability assessment',
            enrolledStudents: 29,
            totalAssignments: 8,
            completedAssignments: 5,
            averageGrade: 91.2,
            status: 'active',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-06-01'),
            category: 'Security',
            thumbnail: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ],
    students: [
        {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice.johnson@university.edu',
            enrolledCourses: ['1', '2'],
            totalAssignments: 22,
            completedAssignments: 18,
            averageGrade: 92.5,
            lastActive: new Date(Date.now() - 1000 * 60 * 30),
            status: 'active'
        },
        {
            id: '2',
            name: 'Bob Smith',
            email: 'bob.smith@university.edu',
            enrolledCourses: ['1', '3'],
            totalAssignments: 20,
            completedAssignments: 15,
            averageGrade: 85.7,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
            status: 'active'
        },
        {
            id: '3',
            name: 'Carol Davis',
            email: 'carol.davis@university.edu',
            enrolledCourses: ['2', '3'],
            totalAssignments: 18,
            completedAssignments: 16,
            averageGrade: 88.9,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
            status: 'active'
        }
    ],
    assignments: [
        {
            id: '1',
            title: 'React Hooks Implementation',
            courseId: '1',
            courseName: 'Advanced React Development',
            description: 'Build a complex application using custom hooks',
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            totalPoints: 100,
            submissions: 42,
            graded: 38,
            averageScore: 87.5,
            status: 'published',
            type: 'project'
        },
        {
            id: '2',
            title: 'SQL Query Optimization',
            courseId: '2',
            courseName: 'Database Design & Management',
            description: 'Optimize complex database queries for performance',
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            totalPoints: 75,
            submissions: 35,
            graded: 30,
            averageScore: 82.1,
            status: 'published',
            type: 'quiz'
        },
        {
            id: '3',
            title: 'Security Vulnerability Assessment',
            courseId: '3',
            courseName: 'Web Security Fundamentals',
            description: 'Conduct a comprehensive security audit of a web application',
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
            totalPoints: 150,
            submissions: 25,
            graded: 20,
            averageScore: 91.3,
            status: 'published',
            type: 'project'
        }
    ],
    stats: {
        totalStudents: 112,
        activeCourses: 3,
        pendingGrades: 24,
        totalAssignments: 30,
        averageGrade: 87.2,
        completionRate: 78.5,
        thisWeekSubmissions: 47,
        monthlyGrowth: 12.5
    },
    recentActivity: [
        {
            id: '1',
            type: 'submission',
            title: 'New Assignment Submission',
            description: 'Alice Johnson submitted React Hooks Implementation',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            studentName: 'Alice Johnson',
            courseName: 'Advanced React Development',
            priority: 'medium'
        },
        {
            id: '2',
            type: 'enrollment',
            title: 'New Student Enrollment',
            description: 'David Wilson enrolled in Web Security Fundamentals',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            studentName: 'David Wilson',
            courseName: 'Web Security Fundamentals',
            priority: 'low'
        },
        {
            id: '3',
            type: 'grade',
            title: 'Grade Update Required',
            description: 'SQL Query Optimization quiz needs grading',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            courseName: 'Database Design & Management',
            priority: 'high'
        }
    ],
    selectedCourse: null
};

function instructorReducer(state: InstructorState, action: InstructorAction): InstructorState {
    switch (action.type) {
        case 'SET_SELECTED_COURSE':
            return { ...state, selectedCourse: action.payload };
        case 'ADD_COURSE':
            return {
                ...state,
                courses: [...state.courses, { ...action.payload, id: Date.now().toString() }]
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
        default:
            return state;
    }
}

export const InstructorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(instructorReducer, initialState);

    const setSelectedCourse = useCallback((courseId: string | null) => {
        dispatch({ type: 'SET_SELECTED_COURSE', payload: courseId });
    }, []);

    const addCourse = useCallback((course: Omit<Course, 'id'>) => {
        dispatch({ type: 'ADD_COURSE', payload: course as Course });
    }, []);

    const updateCourse = useCallback((course: Course) => {
        dispatch({ type: 'UPDATE_COURSE', payload: course });
    }, []);

    const deleteCourse = useCallback((courseId: string) => {
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

    const value: InstructorContextType = {
        state,
        setSelectedCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        addAssignment,
        updateAssignment,
        deleteAssignment
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