import { useState, useEffect } from 'react';
import { Course } from '../types/course';
import { apiService, ApiError } from '../services/api';
import { mapApiCourseToCourse } from '../utils/courseMapper';

interface UseCourseState {
  course: Course | null;
  loading: boolean;
  error: string | null;
}

export const useCourse = (courseId?: string, courseCode?: string) => {
  const [state, setState] = useState<UseCourseState>({
    course: null,
    loading: false,
    error: null,
  });

  const fetchCourseById = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiCourse = await apiService.getCourseById(id);
      const course = mapApiCourseToCourse(apiCourse);
      
      setState(prev => ({
        ...prev,
        course,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `Failed to load course: ${error.message}`
        : 'An unexpected error occurred while loading the course';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const fetchCourseByCourseCode = async (code: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiCourse = await apiService.getCourseByCourseCode(code);
      const course = mapApiCourseToCourse(apiCourse);
      
      setState(prev => ({
        ...prev,
        course,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `Failed to load course: ${error.message}`
        : 'An unexpected error occurred while loading the course';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    } else if (courseCode) {
      fetchCourseByCourseCode(courseCode);
    }
  }, [courseId, courseCode]);

  return {
    ...state,
    refetchById: fetchCourseById,
    refetchByCourseCode: fetchCourseByCourseCode,
  };
};