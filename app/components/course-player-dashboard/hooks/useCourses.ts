import { useState, useEffect } from 'react';
import { Course } from '../types/course';
import { apiService, ApiError } from '../services/api';
import { mapApiCourseToCourse, mapApiCoursesToCourses } from '../utils/courseMapper';

interface UseCoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const useCourses = () => {
  const [state, setState] = useState<UseCoursesState>({
    courses: [],
    loading: false,
    error: null,
  });

  const fetchAllCourses = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiCourses = await apiService.getAllCourses();
      const courses = mapApiCoursesToCourses(apiCourses);
      
      setState(prev => ({
        ...prev,
        courses,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? `Failed to load courses: ${error.message}`
        : 'An unexpected error occurred while loading courses';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return {
    ...state,
    refetch: fetchAllCourses,
  };
};