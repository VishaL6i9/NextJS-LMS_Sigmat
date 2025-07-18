import { Invoice } from '../invoiceGenerator/types/invoice';

const API_BASE_URL = 'http://localhost:8080/api';

// API Response Types
export interface ApiCourse {
  id: string;
  courseName: string;
  courseCode: string;
  courseDescription: string;
  courseDuration: number;
  courseMode: string;
  maxEnrollments: number;
  courseFee: number;
  language: string;
  courseCategory: string;
  instructors: ApiInstructor[];
  rating: number;
  studentsEnrolled: number;
  certificate: boolean;
  lessons: ApiLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiInstructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
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

export interface Role {
  id: number;
  name: string;
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

export interface ApiCourseRequest {
  courseName: string;
  courseCode: string;
  courseDescription: string;
  courseDuration: number;
  courseMode: string;
  maxEnrollments: number;
  courseFee: number;
  language: string;
  courseCategory: string;
  instructors: { instructorId: number }[];
}

export interface ApiCourseUpdate extends ApiCourseRequest {
  courseId: string;
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      if (token) {
        // @ts-ignore
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers,
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
   * Get user roles
   * Endpoint: GET localhost:8080/api/public/role
   */
  async getUserRoles(): Promise<Role[]> {
    try {
      console.log('Fetching user roles...');
      const roles = await this.fetchWithErrorHandling<Role[]>(`${API_BASE_URL}/public/role`);
      console.log(`Successfully fetched ${roles.length} roles`);
      return roles;
    } catch (error) {
      console.error('Failed to fetch user roles:', error);
      throw error;
    }
  }

  /**
   * Get all courses
   * Endpoint: GET localhost:8000/api/courses
   */
  async getAllCourses(): Promise<ApiCourse[]> {
    try {
      console.log('Fetching all courses...');
      const courses = await this.fetchWithErrorHandling<ApiCourse[]>(`${API_BASE_URL}/courses`);
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
      const course = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses/${courseId}`);
      console.log(`Successfully fetched course: ${course.courseName}`);
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
      const response = await this.fetchWithErrorHandling<CourseIdResponse>(`${API_BASE_URL}/courses/${courseCode}/id`);
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
      console.log(`Successfully fetched course by course code: ${course.courseName}`);
      return course;
    } catch (error) {
      console.error(`Failed to fetch course by course code ${courseCode}:`, error);
      throw error;
    }
  }

  /**
   * Create a new course
   * Endpoint: POST localhost:8000/api/courses
   */
  async createCourse(courseData: ApiCourseRequest): Promise<ApiCourse> {
    try {
      console.log('Creating new course:', courseData);
      const newCourse = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses`, {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
      console.log('Successfully created course:', newCourse.courseName);
      return newCourse;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  }

  /**
   * Update an existing course
   * Endpoint: PUT localhost:8000/api/courses/{courseId}
   */
  async updateCourse(courseId: string, courseData: ApiCourseRequest): Promise<ApiCourse> {
    if (!courseId) {
      throw new ApiError('Course ID is required for update', 400);
    }
    try {
      console.log(`Updating course ${courseId}:`, courseData);
      const updatedCourse = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
      console.log('Successfully updated course:', updatedCourse.courseName);
      return updatedCourse;
    } catch (error) {
      console.error(`Failed to update course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a course
   * Endpoint: DELETE localhost:8000/api/courses/{courseId}
   */
  async deleteCourse(courseId: string): Promise<void> {
    if (!courseId) {
      throw new ApiError('Course ID is required for deletion', 400);
    }
    try {
      console.log(`Deleting course ${courseId}`);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
      });
      console.log('Successfully deleted course');
    } catch (error) {
      console.error(`Failed to delete course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Enroll user in a course
   * Endpoint: POST localhost:8000/api/user/enroll
   */
  async enrollUserInCourse(userId: string, courseId: string, instructorId?: number): Promise<void> {
    if (!userId || !courseId) {
      throw new ApiError('User ID and Course ID are required for enrollment', 400);
    }
    try {
      console.log(`Enrolling user ${userId} in course ${courseId}`);
      const queryParams = new URLSearchParams({
        userId,
        courseId,
      });
      if (instructorId) {
        queryParams.append('instructorId', instructorId.toString());
      }
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/user/enroll?${queryParams.toString()}`, {
        method: 'POST',
      });
      console.log('Successfully enrolled user in course');
    } catch (error) {
      console.error(`Failed to enroll user ${userId} in course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Get user enrollments
   * Endpoint: GET localhost:8000/api/user/enrollments/{userId}
   */
  async getUserEnrollments(userId: string): Promise<ApiCourse[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get enrollments', 400);
    }
    try {
      console.log(`Fetching enrollments for user ${userId}`);
      const enrollments = await this.fetchWithErrorHandling<ApiCourse[]>(`${API_BASE_URL}/user/enrollments/${userId}`);
      console.log(`Successfully fetched ${enrollments.length} enrollments for user ${userId}`);
      return enrollments;
    } catch (error) {
      console.error(`Failed to fetch enrollments for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Save an invoice
   * Endpoint: POST localhost:8000/api/invoices
   */
  async saveInvoice(invoiceData: Invoice): Promise<{ invoice: Invoice; stripeInvoiceUrl: string | null }> {
    try {
      console.log('Saving invoice:', invoiceData);
      const response = await this.fetchWithErrorHandling<{ invoice: Invoice; stripeInvoiceUrl: string | null }>(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      console.log('Successfully saved invoice:', response.invoice.invoiceNumber);
      return response;
    } catch (error) {
      console.error('Failed to save invoice:', error);
      throw error;
    }
  }

  /**
   * Get all instructors
   * Endpoint: GET localhost:8000/api/instructors
   */
  async getAllInstructors(): Promise<ApiInstructor[]> {
    try {
      console.log('Fetching all instructors...');
      const instructors = await this.fetchWithErrorHandling<ApiInstructor[]>(`${API_BASE_URL}/instructors`);
      console.log(`Successfully fetched ${instructors.length} instructors`);
      return instructors;
    } catch (error) {
      console.error('Failed to fetch all instructors:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual functions for convenience
export const getUserRoles = () => apiService.getUserRoles();
export const getAllCourses = () => apiService.getAllCourses();
export const getCourseById = (courseId: string) => apiService.getCourseById(courseId);
export const getCourseIdByCourseCode = (courseCode: string) => apiService.getCourseIdByCourseCode(courseCode);
export const getCourseByCourseCode = (courseCode: string) => apiService.getCourseByCourseCode(courseCode);
export const createCourse = (courseData: ApiCourseRequest) => apiService.createCourse(courseData);
export const updateCourse = (courseId: string, courseData: ApiCourseRequest) => apiService.updateCourse(courseId, courseData);
export const deleteCourse = (courseId: string) => apiService.deleteCourse(courseId);
export const getAllInstructors = () => apiService.getAllInstructors();
export const enrollUserInCourse = (userId: string, courseId: string, instructorId?: number) => apiService.enrollUserInCourse(userId, courseId, instructorId);
export const getUserEnrollments = (userId: string) => apiService.getUserEnrollments(userId);
export const saveInvoice = (invoice: Invoice) => apiService.saveInvoice(invoice);
