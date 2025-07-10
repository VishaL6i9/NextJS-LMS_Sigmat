const API_BASE_URL = 'http://localhost:8000/api';

// API Response Types
export interface ApiCourse {
  id: string;
  name: string;
  courseCode: string;
  instructor: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  rating: number;
  studentsEnrolled: number;
  certificate: boolean;
  lessons: ApiLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiLesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  description?: string;
  order: number;
  resources?: ApiResource[];
  quiz?: ApiQuiz;
}

export interface ApiResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'document' | 'code';
  url: string;
  size?: string;
}

export interface ApiQuiz {
  id: string;
  title: string;
  questions: ApiQuestion[];
  passingScore: number;
}

export interface ApiQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CourseIdResponse {
  id: string;
}

// API Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('API call failed:', error);
      throw new ApiError(
        'Network error or server unavailable',
        0,
        error
      );
    }
  }

  /**
   * Get all courses
   * Endpoint: GET localhost:8000/api/courses
   */
  async getAllCourses(): Promise<ApiCourse[]> {
    try {
      console.log('Fetching all courses...');
      const courses = await this.fetchWithErrorHandling<ApiCourse[]>(`${API_BASE_URL}/public/courses`);
      console.log(`Successfully fetched ${courses.length} courses`);
      return courses;
    } catch (error) {
      console.error('Failed to fetch all courses:', error);
      throw error;
    }
  }

  /**
   * Get course by ID
   * Endpoint: GET localhost:8000/api/courses/{courseId}
   */
  async getCourseById(courseId: string): Promise<ApiCourse> {
    if (!courseId) {
      throw new ApiError('Course ID is required', 400);
    }

    try {
      console.log(`Fetching course with ID: ${courseId}`);
      const course = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/public/courses/${courseId}`);
      console.log(`Successfully fetched course: ${course.name}`);
      return course;
    } catch (error) {
      console.error(`Failed to fetch course with ID ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Get course ID by course code
   * Endpoint: GET localhost:8000/api/courses/{coursecode}/id
   */
  async getCourseIdByCourseCode(courseCode: string): Promise<CourseIdResponse> {
    if (!courseCode) {
      throw new ApiError('Course code is required', 400);
    }

    try {
      console.log(`Fetching course ID for course code: ${courseCode}`);
      const response = await this.fetchWithErrorHandling<CourseIdResponse>(`${API_BASE_URL}/public/courses/${courseCode}/id`);
      console.log(`Successfully fetched course ID: ${response.id} for course code: ${courseCode}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch course ID for course code ${courseCode}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to get course by course code
   * This combines getCourseIdByCourseCode and getCourseById
   */
  async getCourseByCourseCode(courseCode: string): Promise<ApiCourse> {
    try {
      console.log(`Fetching course by course code: ${courseCode}`);
      const { id } = await this.getCourseIdByCourseCode(courseCode);
      const course = await this.getCourseById(id);
      console.log(`Successfully fetched course by course code: ${course.name}`);
      return course;
    } catch (error) {
      console.error(`Failed to fetch course by course code ${courseCode}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual functions for convenience
export const getAllCourses = () => apiService.getAllCourses();
export const getCourseById = (courseId: string) => apiService.getCourseById(courseId);
export const getCourseIdByCourseCode = (courseCode: string) => apiService.getCourseIdByCourseCode(courseCode);
export const getCourseByCourseCode = (courseCode: string) => apiService.getCourseByCourseCode(courseCode);