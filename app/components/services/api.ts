import { Invoice } from '../invoiceGenerator/types/invoice';
import { Notification } from '../user-notification-dashboard/types/notification';

const API_BASE_URL = 'http://localhost:8080/api';

// Role Constants
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  INSTITUTION: 'INSTITUTION',
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  USER: 'USER'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Course Scope Constants
export const COURSE_SCOPE = {
  INSTITUTE_ONLY: 'INSTITUTE_ONLY',
  GLOBAL: 'GLOBAL',
  RESTRICTED: 'RESTRICTED'
} as const;

export type CourseScope = typeof COURSE_SCOPE[keyof typeof COURSE_SCOPE];

// API Response Types
export interface ApiCourse {
  courseId: string;
  courseName: string;
  courseCode: string;
  courseDescription: string;
  courseDuration: number;
  courseMode: string;
  maxEnrollments: number;
  courseFee: number;
  language: string;
  courseCategory: string;
  rating: number;
  studentsEnrolled: number;
  certificate: boolean;
  createdAt: string;
  updatedAt: string;
  courseScope: CourseScope;
  instituteId?: number;
  instituteName?: string;
}

export interface ApiInstructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
  instituteId?: number;
  instituteName?: string;
}

export interface ApiModule {
  id: string;
  title: string;
  description: string;
  moduleOrder: number;
  lessons: ApiLesson[];
}

export interface ApiLesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  lessonOrder: number;
  [key: string]: any; // Allow for other properties based on type
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

export interface ApiAssignmentSubmission {
  id?: string;
  content: string;
  filePath?: string;
  userId: string;
  assignmentId: string;
  submissionDate?: string;
  grade?: number;
  feedback?: string;
}

export interface ApiVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  uploadDate: string;
}

export interface ApiCertificate {
  certificateId: string;
  userProfileId: string;
  userProfileFirstName: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorFirstName: string;
  dateOfCertificate: string;
}

export interface ApiEnrollment {
  id: number;
  userId: number;
  username: string;
  courseId: number;
  courseName: string;
  instructorId: number;
  instructorName: string;
  enrollmentDate: string;
}

export interface ApiCheckoutSessionRequest {
  // Legacy fields (for backward compatibility)
  tier?: string;

  // New subscription fields
  planId?: number;
  durationMonths?: number;
  autoRenew?: boolean;

  // Common fields
  successUrl: string;
  cancelUrl: string;
  userId: number;
  courseId?: number;
  instructorId?: number;
}

export interface ApiCheckoutSessionResponse {
  url?: string; // Legacy field
  sessionUrl?: string; // New field
  planId?: number;
  userId?: number;
  courseId?: number;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  instituteId?: number;
  instituteName?: string;
}

export interface ApiInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
}

export interface ApiInstructorUpdate extends ApiInstructorRequest {
  instructorId: number;
}

export interface ApiQuizQuestionRequest {
  questionText: string;
  answerChoices: { choiceText: string; isCorrect: boolean }[];
}

export interface ApiNotificationRequest {
  title: string;
  message: string;
  type: 'SYSTEM' | 'COURSE' | 'ASSIGNMENT' | 'QUIZ';
  category: 'ANNOUNCEMENT' | 'REMINDER' | 'ALERT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ApiNotificationUpdate extends ApiNotificationRequest {
  id: string;
}

export interface ApiAssignmentSubmissionRequest {
  content: string;
  filePath?: string;
}

export interface ApiGradeSubmissionRequest {
  grade: number;
  feedback?: string;
}

export interface ApiVideoUploadResponse {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface ApiCertificateRequest {
  userProfileId: number;
  courseId: number;
  instructorId: number;
  dateOfCertificate: string;
}

export interface ApiCertificateResponse {
  id: string;
  learnerId: number;
  courseId: number;
  instructorId: number;
  dateOfCertificate: string;
  fileUrl?: string;
}

export interface ApiInvoiceRequest {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: string;
  notes?: string;
}

export interface ApiInvoiceResponse {
  invoice: Invoice;
  stripeInvoiceUrl: string | null;
}


export interface CourseIdResponse {
  id: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  language: string;
  timezone: string;
  profileImage?: {
    id: number;
    imageName: string;
    contentType: string;
    imageData: string;
  };
  user: ApiUser;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timezone: string;
  language: string;
}

export interface UpdatePasswordRequest {
  userID: string;
  currentPassword: string;
  newPassword: string;
}

export interface ProfileImageResponse {
  message: string;
  profileImageID: string;
}

export interface SubscriptionPlan {
  id: number;
  courseId?: number | null; // Optional for course-specific plans
  name: string;
  planType: 'LEARNER' | 'FACULTY';
  learnerTier: 'FOUNDATION' | 'ESSENTIAL' | 'PROFESSIONAL' | 'MASTERY' | 'INSTITUTIONAL' | null;
  facultyTier: 'STARTER' | 'EDUCATOR' | 'MENTOR' | 'INSTITUTIONAL' | null;
  priceInr: number;
  description: string;
  features: string[];
  bestSuitedFor: string;
  active: boolean;
  minimumDurationMonths: number;
  customPricing: boolean;
}

export interface UserSubscription {
  id: number;
  userId: number;
  username: string;
  subscriptionPlan: {
    id: number;
    name: string;
    planType: 'LEARNER' | 'FACULTY';
    priceInr: number;
  };
  courseId?: number | null; // Optional for course-specific subscriptions
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  actualPrice: number;
  discountApplied: number;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeUserRequest {
  planId: number;
  courseId?: number | null; // Optional for course-specific subscriptions
  autoRenew: boolean;
  durationMonths: number;
  discountApplied: number;
  paymentReference: string;
}

export interface StripeCheckoutRequest {
  planId: number;
  durationMonths: number;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResponse {
  sessionUrl: string;
  planId: number;
  userId: number;
  courseId?: number;
}

export interface CheckoutSuccessResponse {
  subscription: UserSubscription;
  sessionId: string;
  message: string;
}

// Course Purchase Types
export interface CoursePurchaseRequest {
  successUrl: string;
  cancelUrl: string;
  discountApplied?: number;
  couponCode?: string;
}

export interface CoursePurchaseCheckoutResponse {
  sessionUrl: string;
  purchaseId: number;
  courseId: number;
  userId: number;
  finalAmount: number;
}

export interface CoursePurchase {
  id: number;
  userId: number;
  username: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  purchasePrice: number;
  discountApplied: number;
  finalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentReference: string;
  stripeSessionId?: string;
  purchaseDate: string;
  accessGrantedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoursePurchaseSuccessResponse {
  purchase: CoursePurchase;
  sessionId: string;
  message: string;
}

export interface HasPurchasedResponse {
  hasPurchased: boolean;
}

export interface CourseRevenueResponse {
  courseId: number;
  totalRevenue: number;
  totalEnrollments: number;
}

export interface InstructorRegistrationDTO {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
}

// Attendance API Types
export interface AttendanceRecord {
  id: number;
  userId: number;
  timestamp: string;
}

// Instructor Profile Types
export interface InstructorProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  bio?: string;
  specialization?: string;
  dateOfJoining?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
  timezone?: string;
  language?: string;
  profileImage?: {
    id: number;
    imageName: string;
    contentType: string;
    imageData: string;
  };
}

export interface InstructorProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  bio?: string;
  specialization?: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
  timezone?: string;
  language?: string;
}

export interface InstructorDTO {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
  facebookHandle?: string;
  linkedinHandle?: string;
  youtubeHandle?: string;
  instituteId?: number;
  instituteName?: string;
}

// Institute System Types
export interface InstituteDTO {
  instituteId: number;
  instituteName: string;
  instituteCode: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  establishedDate?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  adminId?: number;
  adminName?: string;
  adminEmail?: string;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
}

export interface InstituteRequestDTO {
  instituteName: string;
  instituteCode: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  establishedDate?: string;
  adminId: number;
}

export interface InstituteStatistics {
  instituteId: number;
  instituteName: string;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  isActive: boolean;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  instituteId?: number;
  instituteName?: string;
}

export interface CourseDTO {
  courseId: number;
  courseName: string;
  courseCode: string;
  courseDescription: string;
  courseDuration: number;
  courseMode: string;
  maxEnrollments: number;
  courseFee: number;
  language: string;
  courseCategory: string;
  rating: number;
  studentsEnrolled: number;
  certificate: boolean;
  createdAt: string;
  updatedAt: string;
  courseScope: CourseScope;
  instituteId?: number;
  instituteName?: string;
}

// Course Access Control Types
export interface CourseSubscriptionRequestDTO {
  instituteId: number;
  courseId: number;
  autoEnrollStudents?: boolean;
  autoEnrollInstructors?: boolean;
}

export interface InstituteSubscriptionDTO {
  id: number;
  instituteId: number;
  instituteName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  subscriptionPrice: number;
  discountApplied: number;
  finalAmount: number;
  subscriptionDate: string;
  expiryDate?: string;
  isActive: boolean;
  autoEnrollStudents: boolean;
  autoEnrollInstructors: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseAccessResponse {
  hasAccess: boolean;
  reason?: string;
}

// Super Admin Types
export interface SystemStats {
  totalUsers: number;
  adminCount: number;
  superAdminCount: number;
  instructorCount: number;
  regularUserCount: number;
  timestamp: string;
}

export interface UserActivityAudit {
  id: string;
  userId: number;
  username: string;
  action: string;
  timestamp: string;
  details?: string;
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

export class InstructorProfileNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstructorProfileNotFoundException';
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
  courseScope: CourseScope;
  instructors: { instructorId: number }[];
}

export interface ApiModuleRequest {
  title: string;
  description: string;
  moduleOrder: number;
}

export interface ApiLessonRequest {
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  lessonOrder: number;
  [key: string]: any;
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
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers,
        ...options,
      });

      if (!response.ok) {
        let errorData = {};
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.warn('Could not parse error response as JSON:', parseError);
          errorData = { message: 'Invalid error response format' };
        }

        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const responseText = await response.text();
          if (!responseText.trim()) {
            throw new Error('Empty JSON response');
          }
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error in API service:', parseError);
          throw new ApiError(
            `Invalid JSON response: ${parseError.message}`,
            response.status,
            { parseError: parseError.message }
          );
        }
      } else if (contentType && contentType.startsWith("image/")) {
        return await response.blob() as T;
      } else {
        return await response.text() as T;
      }
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

  async getUserRoles(): Promise<Role[]> {
    try {
      const roles = await this.fetchWithErrorHandling<Role[]>(`${API_BASE_URL}/public/role`);
      return roles;
    } catch (error) {
      console.error('Failed to fetch user roles:', error);
      throw error;
    }
  }

  // AdminController Methods
  async getAllUsers(): Promise<ApiUser[]> {
    try {
      const users = await this.fetchWithErrorHandling<ApiUser[]>(`${API_BASE_URL}/admin/users`);
      return users;
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      throw error;
    }
  }

  async deleteUserByUsername(username: string): Promise<void> {
    if (!username) {
      throw new ApiError('Username is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/admin/delete/user/${username}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete user ${username}:`, error);
      throw error;
    }
  }

  async changeUserRole(userId: string, newRole: string): Promise<void> {
    if (!userId || !newRole) {
      throw new ApiError('User ID and new role are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/admin/user/${userId}/role?newRole=${newRole}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(`Failed to change role for user ${userId}:`, error);
      throw error;
    }
  }

  async getAllCourses(): Promise<ApiCourse[]> {
    try {
      const courses = await this.fetchWithErrorHandling<ApiCourse[]>(`${API_BASE_URL}/courses`);
      return courses;
    } catch (error) {
      console.error('Failed to fetch all courses:', error);
      throw error;
    }
  }

  async getCourseById(courseId: string): Promise<ApiCourse> {
    if (!courseId || courseId.toString().trim() === '') {
      throw new ApiError('Course ID is required', 400);
    }

    try {
      const course = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses/${courseId}`);
      return course;
    } catch (error) {
      console.error(`Failed to fetch course with ID ${courseId}:`, error);
      throw error;
    }
  }

  async getCourseIdByCourseCode(courseCode: string): Promise<CourseIdResponse> {
    if (!courseCode) {
      throw new ApiError('Course code is required', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<CourseIdResponse>(`${API_BASE_URL}/courses/${courseCode}/id`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch course ID for course code ${courseCode}:`, error);
      throw error;
    }
  }

  async getCoursesByUserId(userId: string): Promise<ApiCourse[]> {
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<ApiCourse[]>(`${API_BASE_URL}/courses/user/${userId}`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch courses for user ID ${userId}:`, error);
      throw error;
    }
  }

  async createCourse(courseData: ApiCourseRequest): Promise<ApiCourse> {
    try {
      const newCourse = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses`, {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
      return newCourse;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, courseData: ApiCourseRequest): Promise<ApiCourse> {
    if (!courseId) {
      throw new ApiError('Course ID is required for update', 400);
    }
    try {
      const updatedCourse = await this.fetchWithErrorHandling<ApiCourse>(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
      return updatedCourse;
    } catch (error) {
      console.error(`Failed to update course ${courseId}:`, error);
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<void> {
    if (!courseId) {
      throw new ApiError('Course ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete course ${courseId}:`, error);
      throw error;
    }
  }

  async createModule(courseId: string, moduleData: ApiModuleRequest): Promise<ApiModule> {
    if (!courseId) {
      throw new ApiError('Course ID is required to create a module', 400);
    }
    try {
      const newModule = await this.fetchWithErrorHandling<ApiModule>(`${API_BASE_URL}/courses/${courseId}/modules`, {
        method: 'POST',
        body: JSON.stringify(moduleData),
      });
      return newModule;
    } catch (error) {
      console.error(`Failed to create module for course ${courseId}:`, error);
      throw error;
    }
  }

  async updateModule(moduleId: string, moduleData: ApiModuleRequest): Promise<ApiModule> {
    if (!moduleId) {
      throw new ApiError('Module ID is required for update', 400);
    }
    try {
      const updatedModule = await this.fetchWithErrorHandling<ApiModule>(`${API_BASE_URL}/modules/${moduleId}`, {
        method: 'PUT',
        body: JSON.stringify(moduleData),
      });
      return updatedModule;
    } catch (error) {
      console.error(`Failed to update module ${moduleId}:`, error);
      throw error;
    }
  }

  async deleteModule(moduleId: string): Promise<void> {
    if (!moduleId) {
      throw new ApiError('Module ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/modules/${moduleId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete module ${moduleId}:`, error);
      throw error;
    }
  }

  async createLesson(moduleId: string, lessonData: ApiLessonRequest): Promise<ApiLesson> {
    if (!moduleId) {
      throw new ApiError('Module ID is required to create a lesson', 400);
    }
    try {
      const newLesson = await this.fetchWithErrorHandling<ApiLesson>(`${API_BASE_URL}/lessons/module/${moduleId}`, {
        method: 'POST',
        body: JSON.stringify(lessonData),
      });
      return newLesson;
    } catch (error) {
      console.error(`Failed to create lesson for module ${moduleId}:`, error);
      throw error;
    }
  }

  async getAllModulesForCourse(courseId: string): Promise<ApiModule[]> {
    if (!courseId) {
      throw new ApiError('Course ID is required to get modules', 400);
    }
    try {
      const modules = await this.fetchWithErrorHandling<ApiModule[]>(`${API_BASE_URL}/courses/${courseId}/modules`);
      return modules;
    } catch (error) {
      console.error(`Failed to fetch modules for course ${courseId}:`, error);
      throw error;
    }
  }

  async updateLesson(lessonId: string, lessonData: ApiLessonRequest): Promise<ApiLesson> {
    if (!lessonId) {
      throw new ApiError('Lesson ID is required for update', 400);
    }
    try {
      const updatedLesson = await this.fetchWithErrorHandling<ApiLesson>(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify(lessonData),
      });
      return updatedLesson;
    } catch (error) {
      console.error(`Failed to update lesson ${lessonId}:`, error);
      throw error;
    }
  }

  async deleteLesson(lessonId: string): Promise<void> {
    if (!lessonId) {
      throw new ApiError('Lesson ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete lesson ${lessonId}:`, error);
      throw error;
    }
  }

  // AssignmentController Methods
  async submitAssignment(assignmentId: string, userId: string, submissionData: ApiAssignmentSubmissionRequest): Promise<ApiAssignmentSubmission> {
    if (!assignmentId || !userId) {
      throw new ApiError('Assignment ID and User ID are required for submission', 400);
    }
    try {
      const formData = new FormData();
      formData.append('content', submissionData.content);
      if (submissionData.filePath) {
        // Assuming filePath is a Blob or File object for upload
        // For simplicity, if it's just a string path, you might need to adjust how it's handled
        // For now, treating it as a file to be appended
        // You might need to fetch the file content if filePath is just a path string
        // For a real application, you'd likely pass a File object directly from an input
        // For this example, I'll assume submissionData.filePath is a File object if present
        // If it's a string, you'd need to read the file and append its content
        // For now, I'll just append the string as a blob if it's not a File object
        if (submissionData.filePath instanceof File) {
          formData.append('file', submissionData.filePath);
        } else if (typeof submissionData.filePath === 'string') {
          // This part might need adjustment based on how you handle file paths on the frontend
          // For now, creating a Blob from the string content as a placeholder
          formData.append('file', new Blob([submissionData.filePath], { type: 'text/plain' }), 'submission.txt');
        }
      }

      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit?userId=${userId}`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header for FormData, browser sets it automatically with boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `Assignment submission failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to submit assignment ${assignmentId} for user ${userId}:`, error);
      throw error;
    }
  }

  async getSubmissionsForAssignment(assignmentId: string): Promise<ApiAssignmentSubmission[]> {
    if (!assignmentId) {
      throw new ApiError('Assignment ID is required to get submissions', 400);
    }
    try {
      const submissions = await this.fetchWithErrorHandling<ApiAssignmentSubmission[]>(`${API_BASE_URL}/assignments/${assignmentId}/submissions`);
      return submissions;
    } catch (error) {
      console.error(`Failed to fetch submissions for assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  async gradeSubmission(submissionId: string, gradeData: ApiGradeSubmissionRequest): Promise<ApiAssignmentSubmission> {
    if (!submissionId) {
      throw new ApiError('Submission ID is required for grading', 400);
    }
    try {
      const queryParams = new URLSearchParams({
        grade: gradeData.grade.toString(),
      });
      if (gradeData.feedback) {
        queryParams.append('feedback', gradeData.feedback);
      }
      const updatedSubmission = await this.fetchWithErrorHandling<ApiAssignmentSubmission>(`${API_BASE_URL}/submissions/${submissionId}/grade?${queryParams.toString()}`, {
        method: 'POST',
      });
      return updatedSubmission;
    } catch (error) {
      console.error(`Failed to grade submission ${submissionId}:`, error);
      throw error;
    }
  }

  // QuizController Methods
  async addQuestionToQuiz(quizId: string, questionData: ApiQuizQuestionRequest): Promise<ApiQuestion> {
    if (!quizId) {
      throw new ApiError('Quiz ID is required to add a question', 400);
    }
    try {
      const newQuestion = await this.fetchWithErrorHandling<ApiQuestion>(`${API_BASE_URL}/quizzes/${quizId}/questions`, {
        method: 'POST',
        body: JSON.stringify(questionData),
      });
      return newQuestion;
    } catch (error) {
      console.error(`Failed to add question to quiz ${quizId}:`, error);
      throw error;
    }
  }

  async getQuiz(quizId: string): Promise<ApiQuiz> {
    if (!quizId) {
      throw new ApiError('Quiz ID is required to get quiz details', 400);
    }
    try {
      const quiz = await this.fetchWithErrorHandling<ApiQuiz>(`${API_BASE_URL}/quizzes/${quizId}`);
      return quiz;
    } catch (error) {
      console.error(`Failed to fetch quiz ${quizId}:`, error);
      throw error;
    }
  }

  async enrollUserInCourse(userId: string, courseId: string, instructorId?: number): Promise<ApiEnrollment> {
    if (!userId || !courseId) {
      throw new ApiError('User ID and Course ID are required for enrollment', 400);
    }
    try {
      const queryParams = new URLSearchParams({
        userId,
        courseId,
      });
      if (instructorId) {
        queryParams.append('instructorId', instructorId.toString());
      }
      const enrollment = await this.fetchWithErrorHandling<ApiEnrollment>(`${API_BASE_URL}/user/enroll?${queryParams.toString()}`, {
        method: 'POST',
      });
      return enrollment;
    } catch (error) {
      console.error(`Failed to enroll user ${userId} in course ${courseId}:`, error);
      throw error;
    }
  }

  async getUserEnrollments(userId: string): Promise<ApiEnrollment[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get enrollments', 400);
    }
    try {
      const enrollments = await this.fetchWithErrorHandling<ApiEnrollment[]>(`${API_BASE_URL}/user/enrollments/${userId}`);
      return enrollments;
    } catch (error) {
      console.error(`Failed to fetch enrollments for user ${userId}:`, error);
      throw error;
    }
  }

  async saveInvoice(invoiceData: Invoice): Promise<{ invoice: Invoice; stripeInvoiceUrl: string | null }> {
    try {
      const response = await this.fetchWithErrorHandling<{ invoice: Invoice; stripeInvoiceUrl: string | null }>(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      return response;
    } catch (error) {
      console.error('Failed to save invoice:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<string> {
    try {
      const response = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/public/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return response;
    } catch (error) {
      console.error('Login failed for user:', username, error);
      throw error;
    }
  }

  async registerUser(userData: { firstName: string; lastName: string; email: string; username: string; password: string; }): Promise<void> {
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/public/register/user`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  async registerInstructor(instructorData: InstructorRegistrationDTO): Promise<string> {
    try {
      const response = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/public/register/instructor`, {
        method: 'POST',
        body: JSON.stringify(instructorData),
      });
      return response;
    } catch (error) {
      console.error('Failed to register instructor:', error);
      throw error;
    }
  }


  async requestPasswordReset(email: string): Promise<string> {
    try {
      const response = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/public/password-reset/request`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error('Failed to request password reset for:', email, error);
      throw error;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<string> {
    try {
      const response = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/public/password-reset/reset`, {
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword }),
      });
      return response;
    } catch (error) {
      console.error('Failed to reset password for:', email, error);
      throw error;
    }
  }

  async getUserId(): Promise<string> {
    try {
      const userId = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/user/profile/getuserID`);
      return userId;
    } catch (error) {
      console.error('Failed to fetch user ID:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    if (!userId) {
      throw new ApiError('User ID is required to get profile', 400);
    }
    try {
      const profile = await this.fetchWithErrorHandling<UserProfile>(`${API_BASE_URL}/user/profile/${userId}`);
      return profile;
    } catch (error) {
      console.error(`Failed to fetch user profile for ID ${userId}:`, error);
      throw error;
    }
  }

  async getProfileImageId(userId: string): Promise<string> {
    if (!userId) {
      throw new ApiError('User ID is required to get profile image ID', 400);
    }
    try {
      const imageId = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/user/profile/getProfileImageID/${userId}`);
      return imageId;
    } catch (error) {
      console.error(`Failed to fetch profile image ID for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getProfileImage(profileImageID: string): Promise<Blob> {
    if (!profileImageID) {
      throw new ApiError('Profile Image ID is required to get image', 400);
    }
    try {
      const imageBlob = await this.fetchWithErrorHandling<Blob>(`${API_BASE_URL}/public/get-image/${profileImageID}`);
      return imageBlob;
    } catch (error) {
      console.error(`Failed to fetch profile image for ID ${profileImageID}:`, error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const updatedProfile = await this.fetchWithErrorHandling<UserProfile>(`${API_BASE_URL}/user/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  async updatePassword(passwordData: UpdatePasswordRequest): Promise<void> {
    try {
      const queryParams = new URLSearchParams({
        userID: passwordData.userID,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/user/profile/password?${queryParams.toString()}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  }



  async uploadProfileImage(userId: string, file: File): Promise<ProfileImageResponse> {
    if (!userId) {
      throw new ApiError('User ID is required for image upload', 400);
    }
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/user/profile/pic/upload/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `Image upload failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Failed to upload profile image for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get notifications', 400);
    }
    try {
      const notifications = await this.fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications/user/${userId}`);
      return notifications;
    } catch (error) {
      console.error(`Failed to fetch notifications for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get unread notifications', 400);
    }
    try {
      const notifications = await this.fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications/user/${userId}/unread`);
      return notifications;
    } catch (error) {
      console.error(`Failed to fetch unread notifications for user ID ${userId}:`, error);
      throw error;
    }
  }

  async addNotification(notification: Omit<Notification, 'id' | 'timestamp'>, userId: number): Promise<Notification> {
    if (!userId) {
      throw new ApiError('User ID is required to add notification', 400);
    }
    try {
      const newNotification = await this.fetchWithErrorHandling<Notification>(`${API_BASE_URL}/notifications?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(notification),
      });
      return newNotification;
    } catch (error) {
      console.error(`Failed to add notification for user ID ${userId}:`, error);
      throw error;
    }
  }

  async addBulkNotifications(notification: Omit<Notification, 'id' | 'timestamp'>, userIds: number[]): Promise<Notification[]> {
    if (!userIds || userIds.length === 0) {
      throw new ApiError('User IDs are required to send bulk notifications', 400);
    }
    try {
      const newNotifications = await this.fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications/bulk?userIds=${userIds.join(',')}`, {
        method: 'POST',
        body: JSON.stringify(notification),
      });
      return newNotifications;
    } catch (error) {
      console.error(`Failed to send bulk notifications to users ${userIds.join(',')}:`, error);
      throw error;
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required to mark as read', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required to mark all as read', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(`Failed to mark all notifications as read for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getNotificationStats(userId: number): Promise<any> {
    if (!userId) {
      throw new ApiError('User ID is required to get notification stats', 400);
    }
    try {
      const stats = await this.fetchWithErrorHandling<any>(`${API_BASE_URL}/notifications/user/${userId}/stats`);
      return stats;
    } catch (error) {
      console.error(`Failed to fetch notification stats for user ID ${userId}:`, error);
      throw error;
    }
  }

  // VideoController Methods
  async uploadVideo(file: File, title: string, description: string): Promise<ApiVideoUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `Video upload failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to upload video:', error);
      throw error;
    }
  }

  async getAllVideos(): Promise<ApiVideo[]> {
    try {
      const videos = await this.fetchWithErrorHandling<ApiVideo[]>(`${API_BASE_URL}/videos`);
      return videos;
    } catch (error) {
      console.error('Failed to fetch all videos:', error);
      throw error;
    }
  }

  async deleteVideo(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Video ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete video ${id}:`, error);
      throw error;
    }
  }

  // CertificateController Methods
  async createCertificate(certificateData: ApiCertificateRequest): Promise<ApiCertificateResponse> {
    try {
      const formData = new FormData();
      formData.append('userProfileId', certificateData.userProfileId.toString());
      formData.append('courseId', certificateData.courseId.toString());
      formData.append('instructorId', certificateData.instructorId.toString());
      formData.append('dateOfCertificate', certificateData.dateOfCertificate);

      const response = await fetch(`${API_BASE_URL}/certificates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `Certificate creation failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to create certificate:', error);
      throw error;
    }
  }

  async getCertificateById(id: string): Promise<ApiCertificate> {
    if (!id) {
      throw new ApiError('Certificate ID is required', 400);
    }
    try {
      const certificate = await this.fetchWithErrorHandling<ApiCertificate>(`${API_BASE_URL}/certificates/${id}`);
      return certificate;
    } catch (error) {
      console.error(`Failed to fetch certificate with ID ${id}:`, error);
      throw error;
    }
  }

  async getAllCertificates(): Promise<ApiCertificate[]> {
    try {
      const certificates = await this.fetchWithErrorHandling<ApiCertificate[]>(`${API_BASE_URL}/certificates`);
      return certificates;
    } catch (error) {
      console.error('Failed to fetch all certificates:', error);
      throw error;
    }
  }

  async deleteCertificate(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Certificate ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/certificates/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete certificate ${id}:`, error);
      throw error;
    }
  }

  // CheckoutController Methods (Legacy - Deprecated)
  async createCheckoutSession(sessionData: ApiCheckoutSessionRequest): Promise<ApiCheckoutSessionResponse> {
    try {
      const response = await this.fetchWithErrorHandling<ApiCheckoutSessionResponse>(`${API_BASE_URL}/checkout/create-checkout-session`, {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      return response;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  // NEW: Stripe Checkout Integration Methods
  async createPlatformSubscriptionCheckout(userId: string, checkoutData: StripeCheckoutRequest): Promise<StripeCheckoutResponse> {
    if (!userId) {
      throw new ApiError('User ID is required for platform subscription checkout', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<StripeCheckoutResponse>(`${API_BASE_URL}/subscriptions/users/${userId}/checkout`, {
        method: 'POST',
        body: JSON.stringify(checkoutData),
      });
      return response;
    } catch (error) {
      console.error(`Failed to create platform subscription checkout for user ${userId}:`, error);
      throw error;
    }
  }

  async createCourseSubscriptionCheckout(courseId: string, userId: string, checkoutData: StripeCheckoutRequest): Promise<StripeCheckoutResponse> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required for course subscription checkout', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<StripeCheckoutResponse>(`${API_BASE_URL}/subscriptions/courses/${courseId}/users/${userId}/checkout`, {
        method: 'POST',
        body: JSON.stringify(checkoutData),
      });
      return response;
    } catch (error) {
      console.error(`Failed to create course subscription checkout for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  async handleCheckoutSuccess(sessionId: string, userId: string): Promise<CheckoutSuccessResponse> {
    if (!sessionId || !userId) {
      throw new ApiError('Session ID and User ID are required for checkout success', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<CheckoutSuccessResponse>(`${API_BASE_URL}/subscriptions/checkout/success?sessionId=${sessionId}&userId=${userId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error(`Failed to handle checkout success for session ${sessionId}:`, error);
      throw error;
    }
  }

  // InstructorController Methods
  async createInstructor(instructorData: ApiInstructorRequest): Promise<ApiInstructor> {
    try {
      const newInstructor = await this.fetchWithErrorHandling<ApiInstructor>(`${API_BASE_URL}/instructors`, {
        method: 'POST',
        body: JSON.stringify(instructorData),
      });
      return newInstructor;
    } catch (error) {
      console.error('Failed to create instructor:', error);
      throw error;
    }
  }

  async getInstructorById(instructorId: string): Promise<ApiInstructor> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required', 400);
    }
    try {
      const instructor = await this.fetchWithErrorHandling<ApiInstructor>(`${API_BASE_URL}/instructors/${instructorId}`);
      return instructor;
    } catch (error) {
      console.error(`Failed to fetch instructor with ID ${instructorId}:`, error);
      throw error;
    }
  }

  async updateInstructor(instructorId: string, instructorData: ApiInstructorUpdate): Promise<ApiInstructor> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required for update', 400);
    }
    try {
      const updatedInstructor = await this.fetchWithErrorHandling<ApiInstructor>(`${API_BASE_URL}/instructors/${instructorId}`, {
        method: 'PUT',
        body: JSON.stringify(instructorData),
      });
      return updatedInstructor;
    } catch (error) {
      console.error(`Failed to update instructor ${instructorId}:`, error);
      throw error;
    }
  }

  async deleteInstructor(instructorId: string): Promise<void> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/instructors/${instructorId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete instructor ${instructorId}:`, error);
      throw error;
    }
  }

  async getAllInstructors(): Promise<ApiInstructor[]> {
    try {
      const instructors = await this.fetchWithErrorHandling<ApiInstructor[]>(`${API_BASE_URL}/instructors`);
      return instructors;
    } catch (error) {
      console.error('Failed to fetch all instructors:', error);
      throw error;
    }
  }

  async getInstructorByUser(userId: string): Promise<ApiInstructor> {
    if (!userId) {
      throw new ApiError('User ID is required to get instructor', 400);
    }
    try {
      const instructor = await this.fetchWithErrorHandling<ApiInstructor>(`${API_BASE_URL}/instructors/user/${userId}`);
      return instructor;
    } catch (error) {
      console.error(`Failed to fetch instructor for user ID ${userId}:`, error);
      throw error;
    }
  }

  // SubscriptionController Methods
  async getSubscriptionPlans(courseId?: number): Promise<SubscriptionPlan[]> {
    try {
      const queryParams = courseId ? `?courseId=${courseId}` : '';
      const plans = await this.fetchWithErrorHandling<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans${queryParams}`);
      return plans;
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      throw error;
    }
  }

  async getLearnerPlans(): Promise<SubscriptionPlan[]> {
    try {
      const plans = await this.fetchWithErrorHandling<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans/learner`);
      return plans;
    } catch (error) {
      console.error('Failed to fetch learner subscription plans:', error);
      throw error;
    }
  }

  async getFacultyPlans(): Promise<SubscriptionPlan[]> {
    try {
      const plans = await this.fetchWithErrorHandling<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans/faculty`);
      return plans;
    } catch (error) {
      console.error('Failed to fetch faculty subscription plans:', error);
      throw error;
    }
  }

  async getPlanById(planId: number): Promise<SubscriptionPlan> {
    if (!planId) {
      throw new ApiError('Plan ID is required', 400);
    }
    try {
      const plan = await this.fetchWithErrorHandling<SubscriptionPlan>(`${API_BASE_URL}/subscriptions/plans/${planId}`);
      return plan;
    } catch (error) {
      console.error(`Failed to fetch subscription plan with ID ${planId}:`, error);
      throw error;
    }
  }

  async subscribeUser(userId: string, subscriptionData: SubscribeUserRequest): Promise<UserSubscription> {
    if (!userId) {
      throw new ApiError('User ID is required to subscribe', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/subscriptions/users/${userId}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
      return subscription;
    } catch (error) {
      console.error(`Failed to subscribe user ${userId}:`, error);
      throw error;
    }
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get subscriptions', 400);
    }
    try {
      const subscriptions = await this.fetchWithErrorHandling<UserSubscription[]>(`${API_BASE_URL}/subscriptions/users/${userId}`);
      return subscriptions;
    } catch (error) {
      console.error(`Failed to fetch subscriptions for user ${userId}:`, error);
      throw error;
    }
  }

  async getCurrentSubscription(userId: string): Promise<UserSubscription> {
    if (!userId) {
      throw new ApiError('User ID is required to get current subscription', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/subscriptions/users/${userId}/current`);
      return subscription;
    } catch (error) {
      console.error(`Failed to fetch current subscription for user ${userId}:`, error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: number): Promise<UserSubscription> {
    if (!subscriptionId) {
      throw new ApiError('Subscription ID is required to cancel', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
      });
      return subscription;
    } catch (error) {
      console.error(`Failed to cancel subscription ${subscriptionId}:`, error);
      throw error;
    }
  }

  // Course-specific subscription methods
  async subscribeToCourse(courseId: string, userId: string, subscriptionData: SubscribeUserRequest): Promise<UserSubscription> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required for course subscription', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/subscriptions/courses/${courseId}/users/${userId}/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
      return subscription;
    } catch (error) {
      console.error(`Failed to subscribe user ${userId} to course ${courseId}:`, error);
      throw error;
    }
  }

  async getCurrentCourseSubscription(courseId: string, userId: string): Promise<UserSubscription> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required to get current course subscription', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/subscriptions/courses/${courseId}/users/${userId}/current`);
      return subscription;
    } catch (error) {
      console.error(`Failed to fetch current course subscription for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  // UserProfileController Subscription Methods
  async getCurrentUserSubscription(userId: string): Promise<UserSubscription> {
    if (!userId) {
      throw new ApiError('User ID is required to get current subscription', 400);
    }
    try {
      const subscription = await this.fetchWithErrorHandling<UserSubscription>(`${API_BASE_URL}/user/subscription/${userId}`);
      return subscription;
    } catch (error) {
      console.error(`Failed to fetch current subscription for user ${userId}:`, error);
      throw error;
    }
  }

  async getAllUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get subscriptions', 400);
    }
    try {
      const subscriptions = await this.fetchWithErrorHandling<UserSubscription[]>(`${API_BASE_URL}/user/subscriptions/${userId}`);
      return subscriptions;
    } catch (error) {
      console.error(`Failed to fetch subscriptions for user ${userId}:`, error);
      throw error;
    }
  }

  // AdminSubscriptionController Methods
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const plans = await this.fetchWithErrorHandling<SubscriptionPlan[]>(`${API_BASE_URL}/admin/subscriptions/plans/all`);
      return plans;
    } catch (error) {
      console.error('Failed to fetch all subscription plans:', error);
      throw error;
    }
  }

  async createSubscriptionPlan(planData: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> {
    try {
      const plan = await this.fetchWithErrorHandling<SubscriptionPlan>(`${API_BASE_URL}/admin/subscriptions/plans`, {
        method: 'POST',
        body: JSON.stringify(planData),
      });
      return plan;
    } catch (error) {
      console.error('Failed to create subscription plan:', error);
      throw error;
    }
  }

  async updateSubscriptionPlan(planId: number, planData: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> {
    if (!planId) {
      throw new ApiError('Plan ID is required for update', 400);
    }
    try {
      const plan = await this.fetchWithErrorHandling<SubscriptionPlan>(`${API_BASE_URL}/admin/subscriptions/plans/${planId}`, {
        method: 'PUT',
        body: JSON.stringify(planData),
      });
      return plan;
    } catch (error) {
      console.error(`Failed to update subscription plan ${planId}:`, error);
      throw error;
    }
  }

  async deactivateSubscriptionPlan(planId: number): Promise<void> {
    if (!planId) {
      throw new ApiError('Plan ID is required for deactivation', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/admin/subscriptions/plans/${planId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to deactivate subscription plan ${planId}:`, error);
      throw error;
    }
  }

  async getAllUserSubscriptionsAdmin(): Promise<UserSubscription[]> {
    try {
      const subscriptions = await this.fetchWithErrorHandling<UserSubscription[]>(`${API_BASE_URL}/admin/subscriptions/users/all`);
      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch all user subscriptions:', error);
      throw error;
    }
  }

  async getActiveUserSubscriptions(): Promise<UserSubscription[]> {
    try {
      const subscriptions = await this.fetchWithErrorHandling<UserSubscription[]>(`${API_BASE_URL}/admin/subscriptions/users/active`);
      return subscriptions;
    } catch (error) {
      console.error('Failed to fetch active user subscriptions:', error);
      throw error;
    }
  }

  async expireAllSubscriptions(): Promise<void> {
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/admin/subscriptions/expire-all`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to expire all subscriptions:', error);
      throw error;
    }
  }

  // Course Purchase Methods
  async createCourseCheckoutSession(courseId: string, userId: string, purchaseData: CoursePurchaseRequest): Promise<CoursePurchaseCheckoutResponse> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required for course checkout', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<CoursePurchaseCheckoutResponse>(`${API_BASE_URL}/courses/${courseId}/users/${userId}/checkout`, {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });
      return response;
    } catch (error) {
      console.error(`Failed to create course checkout session for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  async handleCourseCheckoutSuccess(sessionId: string, userId: string): Promise<CoursePurchaseSuccessResponse> {
    if (!sessionId || !userId) {
      throw new ApiError('Session ID and User ID are required for course checkout success', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<CoursePurchaseSuccessResponse>(`${API_BASE_URL}/courses/checkout/success?sessionId=${sessionId}&userId=${userId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error(`Failed to handle course checkout success for session ${sessionId}:`, error);
      throw error;
    }
  }

  async getCoursePurchaseStatus(courseId: string, userId: string): Promise<CoursePurchase> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required to get purchase status', 400);
    }
    try {
      const purchase = await this.fetchWithErrorHandling<CoursePurchase>(`${API_BASE_URL}/courses/${courseId}/users/${userId}/purchase`);
      return purchase;
    } catch (error) {
      console.error(`Failed to get purchase status for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  async hasUserPurchasedCourse(courseId: string, userId: string): Promise<HasPurchasedResponse> {
    if (!courseId || !userId) {
      throw new ApiError('Course ID and User ID are required to check purchase status', 400);
    }
    try {
      const response = await this.fetchWithErrorHandling<HasPurchasedResponse>(`${API_BASE_URL}/courses/${courseId}/users/${userId}/has-purchased`);
      return response;
    } catch (error) {
      console.error(`Failed to check if user ${userId} has purchased course ${courseId}:`, error);
      throw error;
    }
  }

  async getUserCoursePurchases(userId: string): Promise<CoursePurchase[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get course purchases', 400);
    }
    try {
      const purchases = await this.fetchWithErrorHandling<CoursePurchase[]>(`${API_BASE_URL}/courses/users/${userId}/purchases`);
      return purchases;
    } catch (error) {
      console.error(`Failed to get course purchases for user ${userId}:`, error);
      throw error;
    }
  }

  async getCoursePurchaseAnalytics(courseId: string): Promise<CoursePurchase[]> {
    if (!courseId) {
      throw new ApiError('Course ID is required to get purchase analytics', 400);
    }
    try {
      const purchases = await this.fetchWithErrorHandling<CoursePurchase[]>(`${API_BASE_URL}/courses/${courseId}/purchases`);
      return purchases;
    } catch (error) {
      console.error(`Failed to get purchase analytics for course ${courseId}:`, error);
      throw error;
    }
  }

  async getCourseRevenue(courseId: string): Promise<CourseRevenueResponse> {
    if (!courseId) {
      throw new ApiError('Course ID is required to get course revenue', 400);
    }
    try {
      const revenue = await this.fetchWithErrorHandling<CourseRevenueResponse>(`${API_BASE_URL}/courses/${courseId}/revenue`);
      return revenue;
    } catch (error) {
      console.error(`Failed to get revenue for course ${courseId}:`, error);
      throw error;
    }
  }

  // Attendance API Methods
  async getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const records = await this.fetchWithErrorHandling<AttendanceRecord[]>(`${API_BASE_URL}/user/attendance`);
      return records;
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
      throw error;
    }
  }

  async getAttendanceRecordsInRange(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    if (!startDate || !endDate) {
      throw new ApiError('Start date and end date are required', 400);
    }
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });
      const records = await this.fetchWithErrorHandling<AttendanceRecord[]>(`${API_BASE_URL}/user/attendance/range?${queryParams.toString()}`);
      return records;
    } catch (error) {
      console.error(`Failed to fetch attendance records for range ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

  // Instructor Profile API Methods
  async getInstructorProfile(instructorId: number): Promise<InstructorProfile> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to get profile', 400);
    }
    try {
      const profile = await this.fetchWithErrorHandling<InstructorProfile>(`${API_BASE_URL}/instructor/profile/${instructorId}`);
      return profile;
    } catch (error) {
      console.error(`Failed to fetch instructor profile for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async getInstructorProfileDto(instructorId: number): Promise<InstructorProfileDTO> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to get profile DTO', 400);
    }
    try {
      const profileDto = await this.fetchWithErrorHandling<InstructorProfileDTO>(`${API_BASE_URL}/instructor/profile/${instructorId}/dto`);
      return profileDto;
    } catch (error) {
      console.error(`Failed to fetch instructor profile DTO for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async createInstructorProfile(instructorId: number): Promise<InstructorProfile> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to create profile', 400);
    }
    try {
      const profile = await this.fetchWithErrorHandling<InstructorProfile>(`${API_BASE_URL}/instructor/profile/${instructorId}`, {
        method: 'POST',
      });
      return profile;
    } catch (error) {
      console.error(`Failed to create instructor profile for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async updateInstructorProfile(instructorId: number, profileData: InstructorProfileDTO): Promise<InstructorProfile> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to update profile', 400);
    }
    try {
      const updatedProfile = await this.fetchWithErrorHandling<InstructorProfile>(`${API_BASE_URL}/instructor/profile/${instructorId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      return updatedProfile;
    } catch (error) {
      console.error(`Failed to update instructor profile for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async updateInstructorPassword(newPassword: string): Promise<void> {
    if (!newPassword) {
      throw new ApiError('New password is required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/instructor/profile/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      });
    } catch (error) {
      console.error('Failed to update instructor password:', error);
      throw error;
    }
  }

  async getInstructorIdFromToken(): Promise<number> {
    try {
      const instructorId = await this.fetchWithErrorHandling<number>(`${API_BASE_URL}/instructor/profile/getInstructorId`);
      return instructorId;
    } catch (error) {
      console.error('Failed to get instructor ID from token:', error);
      throw error;
    }
  }

  async getInstructorProfileImageId(instructorId: number): Promise<string> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to get profile image ID', 400);
    }
    try {
      const imageId = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/instructor/profile/getProfileImageID/${instructorId}`);
      return imageId;
    } catch (error) {
      console.error(`Failed to fetch instructor profile image ID for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async uploadInstructorProfileImage(instructorId: number, file: File): Promise<ProfileImageResponse> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required for image upload', 400);
    }
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/instructor/profile/pic/upload/${instructorId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `Instructor image upload failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to upload instructor profile image for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async getInstructorProfileImage(instructorId: number): Promise<Blob> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to get profile image', 400);
    }
    try {
      const imageBlob = await this.fetchWithErrorHandling<Blob>(`${API_BASE_URL}/instructor/profile/pic/${instructorId}`);
      return imageBlob;
    } catch (error) {
      console.error(`Failed to fetch instructor profile image for ID ${instructorId}:`, error);
      throw error;
    }
  }

  async getInstructorProfileWithImage(instructorId: number): Promise<InstructorProfile> {
    if (!instructorId) {
      throw new ApiError('Instructor ID is required to get profile with image', 400);
    }
    try {
      const profile = await this.fetchWithErrorHandling<InstructorProfile>(`${API_BASE_URL}/instructor/profile/${instructorId}/with-image`);
      return profile;
    } catch (error) {
      console.error(`Failed to fetch instructor profile with image for ID ${instructorId}:`, error);
      throw error;
    }
  }

  // Institute API Methods
  async createInstitute(instituteData: InstituteRequestDTO): Promise<InstituteDTO> {
    try {
      const institute = await this.fetchWithErrorHandling<InstituteDTO>(`${API_BASE_URL}/institutes`, {
        method: 'POST',
        body: JSON.stringify(instituteData),
      });
      return institute;
    } catch (error) {
      console.error('Failed to create institute:', error);
      throw error;
    }
  }

  async getAllInstitutes(): Promise<InstituteDTO[]> {
    try {
      const institutes = await this.fetchWithErrorHandling<InstituteDTO[]>(`${API_BASE_URL}/institutes`);
      return institutes;
    } catch (error) {
      console.error('Failed to fetch all institutes:', error);
      throw error;
    }
  }

  async getActiveInstitutes(): Promise<InstituteDTO[]> {
    try {
      const institutes = await this.fetchWithErrorHandling<InstituteDTO[]>(`${API_BASE_URL}/institutes/active`);
      return institutes;
    } catch (error) {
      console.error('Failed to fetch active institutes:', error);
      throw error;
    }
  }

  async getInstituteById(instituteId: number): Promise<InstituteDTO> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const institute = await this.fetchWithErrorHandling<InstituteDTO>(`${API_BASE_URL}/institutes/${instituteId}`);
      return institute;
    } catch (error) {
      console.error(`Failed to fetch institute with ID ${instituteId}:`, error);
      throw error;
    }
  }

  async getInstituteByCode(instituteCode: string): Promise<InstituteDTO> {
    if (!instituteCode) {
      throw new ApiError('Institute code is required', 400);
    }
    try {
      const institute = await this.fetchWithErrorHandling<InstituteDTO>(`${API_BASE_URL}/institutes/code/${instituteCode}`);
      return institute;
    } catch (error) {
      console.error(`Failed to fetch institute with code ${instituteCode}:`, error);
      throw error;
    }
  }

  async getInstituteByAdminId(adminId: number): Promise<InstituteDTO> {
    if (!adminId) {
      throw new ApiError('Admin ID is required', 400);
    }
    try {
      const institute = await this.fetchWithErrorHandling<InstituteDTO>(`${API_BASE_URL}/institutes/admin/${adminId}`);
      return institute;
    } catch (error) {
      console.error(`Failed to fetch institute for admin ID ${adminId}:`, error);
      throw error;
    }
  }

  async updateInstitute(instituteId: number, instituteData: InstituteDTO): Promise<InstituteDTO> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required for update', 400);
    }
    try {
      const updatedInstitute = await this.fetchWithErrorHandling<InstituteDTO>(`${API_BASE_URL}/institutes/${instituteId}`, {
        method: 'PUT',
        body: JSON.stringify(instituteData),
      });
      return updatedInstitute;
    } catch (error) {
      console.error(`Failed to update institute ${instituteId}:`, error);
      throw error;
    }
  }

  async deactivateInstitute(instituteId: number): Promise<void> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required for deactivation', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/deactivate`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error(`Failed to deactivate institute ${instituteId}:`, error);
      throw error;
    }
  }

  async activateInstitute(instituteId: number): Promise<void> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required for activation', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/activate`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error(`Failed to activate institute ${instituteId}:`, error);
      throw error;
    }
  }

  async deleteInstitute(instituteId: number): Promise<void> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete institute ${instituteId}:`, error);
      throw error;
    }
  }

  // Institute Resource Management Methods
  async addStudentToInstitute(instituteId: number, studentId: number): Promise<void> {
    if (!instituteId || !studentId) {
      throw new ApiError('Institute ID and Student ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/students/${studentId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to add student ${studentId} to institute ${instituteId}:`, error);
      throw error;
    }
  }

  async removeStudentFromInstitute(instituteId: number, studentId: number): Promise<void> {
    if (!instituteId || !studentId) {
      throw new ApiError('Institute ID and Student ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/students/${studentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to remove student ${studentId} from institute ${instituteId}:`, error);
      throw error;
    }
  }

  async getInstituteStudents(instituteId: number): Promise<UserDTO[]> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const students = await this.fetchWithErrorHandling<UserDTO[]>(`${API_BASE_URL}/institutes/${instituteId}/management/students`);
      return students;
    } catch (error) {
      console.error(`Failed to fetch students for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async addInstructorToInstitute(instituteId: number, instructorId: number): Promise<void> {
    if (!instituteId || !instructorId) {
      throw new ApiError('Institute ID and Instructor ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/instructors/${instructorId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to add instructor ${instructorId} to institute ${instituteId}:`, error);
      throw error;
    }
  }

  async removeInstructorFromInstitute(instituteId: number, instructorId: number): Promise<void> {
    if (!instituteId || !instructorId) {
      throw new ApiError('Institute ID and Instructor ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/instructors/${instructorId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to remove instructor ${instructorId} from institute ${instituteId}:`, error);
      throw error;
    }
  }

  async getInstituteInstructors(instituteId: number): Promise<InstructorDTO[]> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const instructors = await this.fetchWithErrorHandling<InstructorDTO[]>(`${API_BASE_URL}/institutes/${instituteId}/management/instructors`);
      return instructors;
    } catch (error) {
      console.error(`Failed to fetch instructors for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async addCourseToInstitute(instituteId: number, courseId: number): Promise<void> {
    if (!instituteId || !courseId) {
      throw new ApiError('Institute ID and Course ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/courses/${courseId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to add course ${courseId} to institute ${instituteId}:`, error);
      throw error;
    }
  }

  async removeCourseFromInstitute(instituteId: number, courseId: number): Promise<void> {
    if (!instituteId || !courseId) {
      throw new ApiError('Institute ID and Course ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/courses/${courseId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to remove course ${courseId} from institute ${instituteId}:`, error);
      throw error;
    }
  }

  async getInstituteCourses(instituteId: number): Promise<CourseDTO[]> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<CourseDTO[]>(`${API_BASE_URL}/institutes/${instituteId}/management/courses`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch courses for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async getInstituteCoursesByCategory(instituteId: number, category: string): Promise<CourseDTO[]> {
    if (!instituteId || !category) {
      throw new ApiError('Institute ID and category are required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<CourseDTO[]>(`${API_BASE_URL}/institutes/${instituteId}/management/courses/category/${category}`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch courses by category ${category} for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async changeInstituteAdmin(instituteId: number, newAdminId: number): Promise<void> {
    if (!instituteId || !newAdminId) {
      throw new ApiError('Institute ID and new admin ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/institutes/${instituteId}/management/admin/${newAdminId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(`Failed to change admin for institute ${instituteId} to user ${newAdminId}:`, error);
      throw error;
    }
  }

  async getInstituteStatistics(instituteId: number): Promise<InstituteStatistics> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const statistics = await this.fetchWithErrorHandling<InstituteStatistics>(`${API_BASE_URL}/institutes/${instituteId}/management/statistics`);
      return statistics;
    } catch (error) {
      console.error(`Failed to fetch statistics for institute ${instituteId}:`, error);
      throw error;
    }
  }

  // Course Access Control API Methods
  async getUserAccessibleCourses(userId: string): Promise<CourseDTO[]> {
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<CourseDTO[]>(`${API_BASE_URL}/course-access/user/${userId}/courses`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch accessible courses for user ${userId}:`, error);
      throw error;
    }
  }

  async checkUserCourseAccess(userId: string, courseId: string): Promise<boolean> {
    if (!userId || !courseId) {
      throw new ApiError('User ID and Course ID are required', 400);
    }
    try {
      const hasAccess = await this.fetchWithErrorHandling<boolean>(`${API_BASE_URL}/course-access/user/${userId}/course/${courseId}/access`);
      return hasAccess;
    } catch (error) {
      console.error(`Failed to check course access for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  async getInstituteSubscribedCourses(instituteId: number): Promise<CourseDTO[]> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<CourseDTO[]>(`${API_BASE_URL}/course-access/institute/${instituteId}/subscribed-courses`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch subscribed courses for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async subscribeInstituteToGlobalCourse(subscriptionData: CourseSubscriptionRequestDTO): Promise<InstituteSubscriptionDTO> {
    try {
      const subscription = await this.fetchWithErrorHandling<InstituteSubscriptionDTO>(`${API_BASE_URL}/course-access/institute/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe institute to global course:', error);
      throw error;
    }
  }

  async unsubscribeInstituteFromCourse(instituteId: number, courseId: number): Promise<void> {
    if (!instituteId || !courseId) {
      throw new ApiError('Institute ID and Course ID are required', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/course-access/institute/${instituteId}/course/${courseId}/unsubscribe`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to unsubscribe institute ${instituteId} from course ${courseId}:`, error);
      throw error;
    }
  }

  async getInstituteSubscriptions(instituteId: number): Promise<InstituteSubscriptionDTO[]> {
    if (!instituteId) {
      throw new ApiError('Institute ID is required', 400);
    }
    try {
      const subscriptions = await this.fetchWithErrorHandling<InstituteSubscriptionDTO[]>(`${API_BASE_URL}/course-access/institute/${instituteId}/subscriptions`);
      return subscriptions;
    } catch (error) {
      console.error(`Failed to fetch subscriptions for institute ${instituteId}:`, error);
      throw error;
    }
  }

  async getCourseSubscriptions(courseId: number): Promise<InstituteSubscriptionDTO[]> {
    if (!courseId) {
      throw new ApiError('Course ID is required', 400);
    }
    try {
      const subscriptions = await this.fetchWithErrorHandling<InstituteSubscriptionDTO[]>(`${API_BASE_URL}/course-access/course/${courseId}/subscriptions`);
      return subscriptions;
    } catch (error) {
      console.error(`Failed to fetch subscriptions for course ${courseId}:`, error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: number, subscriptionData: InstituteSubscriptionDTO): Promise<InstituteSubscriptionDTO> {
    if (!subscriptionId) {
      throw new ApiError('Subscription ID is required', 400);
    }
    try {
      const updatedSubscription = await this.fetchWithErrorHandling<InstituteSubscriptionDTO>(`${API_BASE_URL}/course-access/subscription/${subscriptionId}`, {
        method: 'PUT',
        body: JSON.stringify(subscriptionData),
      });
      return updatedSubscription;
    } catch (error) {
      console.error(`Failed to update subscription ${subscriptionId}:`, error);
      throw error;
    }
  }

  async deactivateExpiredSubscriptions(): Promise<void> {
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/course-access/maintenance/deactivate-expired`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to deactivate expired subscriptions:', error);
      throw error;
    }
  }

  // Enhanced Course Access Methods
  async getCoursesAccessibleToUser(userId: string): Promise<CourseDTO[]> {
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    try {
      const courses = await this.fetchWithErrorHandling<CourseDTO[]>(`${API_BASE_URL}/courses/user/${userId}/accessible`);
      return courses;
    } catch (error) {
      console.error(`Failed to fetch accessible courses for user ${userId}:`, error);
      throw error;
    }
  }

  async checkUserAccessToCourse(userId: string, courseId: string): Promise<boolean> {
    if (!userId || !courseId) {
      throw new ApiError('User ID and Course ID are required', 400);
    }
    try {
      const hasAccess = await this.fetchWithErrorHandling<boolean>(`${API_BASE_URL}/courses/user/${userId}/course/${courseId}/access`);
      return hasAccess;
    } catch (error) {
      console.error(`Failed to check user access to course for user ${userId} and course ${courseId}:`, error);
      throw error;
    }
  }

  // Super Admin API Methods
  async getAllUsersForSuperAdmin(): Promise<ApiUser[]> {
    try {
      const users = await this.fetchWithErrorHandling<ApiUser[]>(`${API_BASE_URL}/super-admin/users`);
      return users;
    } catch (error) {
      console.error('Failed to fetch all users for super admin:', error);
      throw error;
    }
  }

  async getAllAdminUsers(): Promise<ApiUser[]> {
    try {
      const admins = await this.fetchWithErrorHandling<ApiUser[]>(`${API_BASE_URL}/super-admin/users/admins`);
      return admins;
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      throw error;
    }
  }

  async getAllSuperAdminUsers(): Promise<ApiUser[]> {
    try {
      const superAdmins = await this.fetchWithErrorHandling<ApiUser[]>(`${API_BASE_URL}/super-admin/users/super-admins`);
      return superAdmins;
    } catch (error) {
      console.error('Failed to fetch super admin users:', error);
      throw error;
    }
  }

  async promoteUserToAdmin(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required for promotion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/super-admin/users/${userId}/promote-to-admin`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to promote user ${userId} to admin:`, error);
      throw error;
    }
  }

  async promoteUserToSuperAdmin(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required for promotion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/super-admin/users/${userId}/promote-to-super-admin`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to promote user ${userId} to super admin:`, error);
      throw error;
    }
  }

  async demoteUserToRegular(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required for demotion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/super-admin/users/${userId}/demote-to-user`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to demote user ${userId} to regular user:`, error);
      throw error;
    }
  }

  async forceDeleteUser(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required for force deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/super-admin/users/${userId}/force-delete`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to force delete user ${userId}:`, error);
      throw error;
    }
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      const stats = await this.fetchWithErrorHandling<SystemStats>(`${API_BASE_URL}/super-admin/system/stats`);
      return stats;
    } catch (error) {
      console.error('Failed to fetch system statistics:', error);
      throw error;
    }
  }

  async toggleMaintenanceMode(enabled: boolean): Promise<void> {
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/super-admin/system/maintenance-mode?enabled=${enabled}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to toggle maintenance mode to ${enabled}:`, error);
      throw error;
    }
  }

  async getUserActivityAuditLogs(): Promise<UserActivityAudit[]> {
    try {
      const auditLogs = await this.fetchWithErrorHandling<UserActivityAudit[]>(`${API_BASE_URL}/super-admin/audit/user-activities`);
      return auditLogs;
    } catch (error) {
      console.error('Failed to fetch user activity audit logs:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();

export const getUserRoles = () => apiService.getUserRoles();
export const getAllCourses = () => apiService.getAllCourses();
export const getCourseById = (courseId: string) => apiService.getCourseById(courseId);
export const getCoursesByUserId = (userId: string) => apiService.getCoursesByUserId(userId);
export const createCourse = (courseData: ApiCourseRequest) => apiService.createCourse(courseData);
export const updateCourse = (courseId: string, courseData: ApiCourseRequest) => apiService.updateCourse(courseId, courseData);
export const deleteCourse = (courseId: string) => apiService.deleteCourse(courseId);
export const createModule = (courseId: string, moduleData: ApiModuleRequest) => apiService.createModule(courseId, moduleData);
export const updateModule = (moduleId: string, moduleData: ApiModuleRequest) => apiService.updateModule(moduleId, moduleData);
export const deleteModule = (moduleId: string) => apiService.deleteModule(moduleId);
export const createLesson = (moduleId: string, lessonData: ApiLessonRequest) => apiService.createLesson(moduleId, lessonData);
export const updateLesson = (lessonId: string, lessonData: ApiLessonRequest) => apiService.updateLesson(lessonId, lessonData);
export const deleteLesson = (lessonId: string) => apiService.deleteLesson(lessonId);
export const getAllModulesForCourse = (courseId: string) => apiService.getAllModulesForCourse(courseId);
export const getAllInstructors = () => apiService.getAllInstructors();
export const getInstructorByUser = (userId: string) => apiService.getInstructorByUser(userId);
export const enrollUserInCourse = (userId: string, courseId: string, instructorId?: number) => apiService.enrollUserInCourse(userId, courseId, instructorId);
export const getUserEnrollments = (userId: string) => apiService.getUserEnrollments(userId);
export const saveInvoice = (invoice: Invoice) => apiService.saveInvoice(invoice);
export const getUserId = () => apiService.getUserId();
export const getUserProfile = (userId: string) => apiService.getUserProfile(userId);
export const getProfileImageId = (userId: string) => apiService.getProfileImageId(userId);
export const getProfileImage = (profileImageID: string) => apiService.getProfileImage(profileImageID);
export const updateUserProfile = (userId: string, profileData: UpdateProfileRequest) => apiService.updateUserProfile(userId, profileData);
export const updatePassword = (passwordData: UpdatePasswordRequest) => apiService.updatePassword(passwordData);
export const uploadProfileImage = (userId: string, file: File) => apiService.uploadProfileImage(userId, file);
export const registerUser = (userData: { firstName: string; lastName: string; email: string; username: string; password: string; }) => apiService.registerUser(userData);
export const registerInstructor = (instructorData: InstructorRegistrationDTO) => apiService.registerInstructor(instructorData);
export const requestPasswordReset = (email: string) => apiService.requestPasswordReset(email);
export const resetPassword = (email: string, token: string, newPassword: string) => apiService.resetPassword(email, token, newPassword);
export const login = (username: string, password: string) => apiService.login(username, password);
export const getNotifications = (userId: number) => apiService.getNotifications(userId);
export const getUnreadNotifications = (userId: number) => apiService.getUnreadNotifications(userId);
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>, userId: number) => apiService.addNotification(notification, userId);
export const addBulkNotifications = (notification: Omit<Notification, 'id' | 'timestamp'>, userIds: number[]) => apiService.addBulkNotifications(notification, userIds);
export const markNotificationAsRead = (id: string) => apiService.markNotificationAsRead(id);
export const markAllNotificationsAsRead = (userId: number) => apiService.markAllNotificationsAsRead(userId);
export const getNotificationStats = (userId: number) => apiService.getNotificationStats(userId);
export const uploadVideo = (file: File, title: string, description: string) => apiService.uploadVideo(file, title, description);
export const getAllVideos = () => apiService.getAllVideos();
export const deleteVideo = (id: string) => apiService.deleteVideo(id);
export const createCertificate = (certificateData: ApiCertificateRequest) => apiService.createCertificate(certificateData);
export const getCertificateById = (id: string) => apiService.getCertificateById(id);
export const getAllCertificates = () => apiService.getAllCertificates();
export const deleteCertificate = (id: string) => apiService.deleteCertificate(id);
export const createCheckoutSession = (sessionData: ApiCheckoutSessionRequest) => apiService.createCheckoutSession(sessionData);
export const createPlatformSubscriptionCheckout = (userId: string, checkoutData: StripeCheckoutRequest) => apiService.createPlatformSubscriptionCheckout(userId, checkoutData);
export const createCourseSubscriptionCheckout = (courseId: string, userId: string, checkoutData: StripeCheckoutRequest) => apiService.createCourseSubscriptionCheckout(courseId, userId, checkoutData);
export const handleCheckoutSuccess = (sessionId: string, userId: string) => apiService.handleCheckoutSuccess(sessionId, userId);
export const createInstructor = (instructorData: ApiInstructorRequest) => apiService.createInstructor(instructorData);
export const getInstructorById = (instructorId: string) => apiService.getInstructorById(instructorId);
export const updateInstructor = (instructorId: string, instructorData: ApiInstructorUpdate) => apiService.updateInstructor(instructorId, instructorData);
export const deleteInstructor = (instructorId: string) => apiService.deleteInstructor(instructorId);
export const addQuestionToQuiz = (quizId: string, questionData: ApiQuizQuestionRequest) => apiService.addQuestionToQuiz(quizId, questionData);
export const getQuiz = (quizId: string) => apiService.getQuiz(quizId);
export const submitAssignment = (assignmentId: string, userId: string, submissionData: ApiAssignmentSubmissionRequest) => apiService.submitAssignment(assignmentId, userId, submissionData);
export const getSubmissionsForAssignment = (assignmentId: string) => apiService.getSubmissionsForAssignment(assignmentId);
export const gradeSubmission = (submissionId: string, gradeData: ApiGradeSubmissionRequest) => apiService.gradeSubmission(submissionId, gradeData);
export const getAllUsers = () => apiService.getAllUsers();
export const deleteUserByUsername = (username: string) => apiService.deleteUserByUsername(username);
export const changeUserRole = (userId: string, newRole: string) => apiService.changeUserRole(userId, newRole);
export const getSubscriptionPlans = (courseId?: number) => apiService.getSubscriptionPlans(courseId);
export const getLearnerPlans = () => apiService.getLearnerPlans();
export const getFacultyPlans = () => apiService.getFacultyPlans();
export const getPlanById = (planId: number) => apiService.getPlanById(planId);
export const subscribeUser = (userId: string, subscriptionData: SubscribeUserRequest) => apiService.subscribeUser(userId, subscriptionData);
export const getUserSubscriptions = (userId: string) => apiService.getUserSubscriptions(userId);
export const getCurrentSubscription = (userId: string) => apiService.getCurrentSubscription(userId);
export const cancelSubscription = (subscriptionId: number) => apiService.cancelSubscription(subscriptionId);
export const getCurrentUserSubscription = (userId: string) => apiService.getCurrentUserSubscription(userId);
export const getAllUserSubscriptions = (userId: string) => apiService.getAllUserSubscriptions(userId);
export const getAllSubscriptionPlans = () => apiService.getAllSubscriptionPlans();
export const createSubscriptionPlan = (planData: Omit<SubscriptionPlan, 'id'>) => apiService.createSubscriptionPlan(planData);
export const updateSubscriptionPlan = (planId: number, planData: Omit<SubscriptionPlan, 'id'>) => apiService.updateSubscriptionPlan(planId, planData);
export const deactivateSubscriptionPlan = (planId: number) => apiService.deactivateSubscriptionPlan(planId);
export const getAllUserSubscriptionsAdmin = () => apiService.getAllUserSubscriptionsAdmin();
export const getActiveUserSubscriptions = () => apiService.getActiveUserSubscriptions();
export const expireAllSubscriptions = () => apiService.expireAllSubscriptions();
export const subscribeToCourse = (courseId: string, userId: string, subscriptionData: SubscribeUserRequest) => apiService.subscribeToCourse(courseId, userId, subscriptionData);
export const getCurrentCourseSubscription = (courseId: string, userId: string) => apiService.getCurrentCourseSubscription(courseId, userId);

// Course Purchase exports
export const createCourseCheckoutSession = (courseId: string, userId: string, purchaseData: CoursePurchaseRequest) => apiService.createCourseCheckoutSession(courseId, userId, purchaseData);
export const handleCourseCheckoutSuccess = (sessionId: string, userId: string) => apiService.handleCourseCheckoutSuccess(sessionId, userId);
export const getCoursePurchaseStatus = (courseId: string, userId: string) => apiService.getCoursePurchaseStatus(courseId, userId);
export const hasUserPurchasedCourse = (courseId: string, userId: string) => apiService.hasUserPurchasedCourse(courseId, userId);
export const getUserCoursePurchases = (userId: string) => apiService.getUserCoursePurchases(userId);
export const getCoursePurchaseAnalytics = (courseId: string) => apiService.getCoursePurchaseAnalytics(courseId);
export const getCourseRevenue = (courseId: string) => apiService.getCourseRevenue(courseId);

// Attendance API exports
export const getAllAttendanceRecords = () => apiService.getAllAttendanceRecords();
export const getAttendanceRecordsInRange = (startDate: string, endDate: string) => apiService.getAttendanceRecordsInRange(startDate, endDate);

// Instructor Profile API exports
export const getInstructorProfile = (instructorId: number) => apiService.getInstructorProfile(instructorId);
export const getInstructorProfileDto = (instructorId: number) => apiService.getInstructorProfileDto(instructorId);
export const createInstructorProfile = (instructorId: number) => apiService.createInstructorProfile(instructorId);
export const updateInstructorProfile = (instructorId: number, profileData: InstructorProfileDTO) => apiService.updateInstructorProfile(instructorId, profileData);
export const updateInstructorPassword = (newPassword: string) => apiService.updateInstructorPassword(newPassword);
export const getInstructorIdFromToken = () => apiService.getInstructorIdFromToken();
export const getInstructorProfileImageId = (instructorId: number) => apiService.getInstructorProfileImageId(instructorId);
export const uploadInstructorProfileImage = (instructorId: number, file: File) => apiService.uploadInstructorProfileImage(instructorId, file);
export const getInstructorProfileImage = (instructorId: number) => apiService.getInstructorProfileImage(instructorId);
export const getInstructorProfileWithImage = (instructorId: number) => apiService.getInstructorProfileWithImage(instructorId);

// Institute API exports
export const createInstitute = (instituteData: InstituteRequestDTO) => apiService.createInstitute(instituteData);
export const getAllInstitutes = () => apiService.getAllInstitutes();
export const getActiveInstitutes = () => apiService.getActiveInstitutes();
export const getInstituteById = (instituteId: number) => apiService.getInstituteById(instituteId);
export const getInstituteByCode = (instituteCode: string) => apiService.getInstituteByCode(instituteCode);
export const getInstituteByAdminId = (adminId: number) => apiService.getInstituteByAdminId(adminId);
export const updateInstitute = (instituteId: number, instituteData: InstituteDTO) => apiService.updateInstitute(instituteId, instituteData);
export const deactivateInstitute = (instituteId: number) => apiService.deactivateInstitute(instituteId);
export const activateInstitute = (instituteId: number) => apiService.activateInstitute(instituteId);
export const deleteInstitute = (instituteId: number) => apiService.deleteInstitute(instituteId);

// Institute Resource Management exports
export const addStudentToInstitute = (instituteId: number, studentId: number) => apiService.addStudentToInstitute(instituteId, studentId);
export const removeStudentFromInstitute = (instituteId: number, studentId: number) => apiService.removeStudentFromInstitute(instituteId, studentId);
export const getInstituteStudents = (instituteId: number) => apiService.getInstituteStudents(instituteId);
export const addInstructorToInstitute = (instituteId: number, instructorId: number) => apiService.addInstructorToInstitute(instituteId, instructorId);
export const removeInstructorFromInstitute = (instituteId: number, instructorId: number) => apiService.removeInstructorFromInstitute(instituteId, instructorId);
export const getInstituteInstructors = (instituteId: number) => apiService.getInstituteInstructors(instituteId);
export const addCourseToInstitute = (instituteId: number, courseId: number) => apiService.addCourseToInstitute(instituteId, courseId);
export const removeCourseFromInstitute = (instituteId: number, courseId: number) => apiService.removeCourseFromInstitute(instituteId, courseId);
export const getInstituteCourses = (instituteId: number) => apiService.getInstituteCourses(instituteId);
export const getInstituteCoursesByCategory = (instituteId: number, category: string) => apiService.getInstituteCoursesByCategory(instituteId, category);
export const changeInstituteAdmin = (instituteId: number, newAdminId: number) => apiService.changeInstituteAdmin(instituteId, newAdminId);
export const getInstituteStatistics = (instituteId: number) => apiService.getInstituteStatistics(instituteId);

// Course Access Control API exports
export const getUserAccessibleCourses = (userId: string) => apiService.getUserAccessibleCourses(userId);
export const checkUserCourseAccess = (userId: string, courseId: string) => apiService.checkUserCourseAccess(userId, courseId);
export const getInstituteSubscribedCourses = (instituteId: number) => apiService.getInstituteSubscribedCourses(instituteId);
export const subscribeInstituteToGlobalCourse = (subscriptionData: CourseSubscriptionRequestDTO) => apiService.subscribeInstituteToGlobalCourse(subscriptionData);
export const unsubscribeInstituteFromCourse = (instituteId: number, courseId: number) => apiService.unsubscribeInstituteFromCourse(instituteId, courseId);
export const getInstituteSubscriptions = (instituteId: number) => apiService.getInstituteSubscriptions(instituteId);
export const getCourseSubscriptions = (courseId: number) => apiService.getCourseSubscriptions(courseId);
export const updateSubscription = (subscriptionId: number, subscriptionData: InstituteSubscriptionDTO) => apiService.updateSubscription(subscriptionId, subscriptionData);
export const deactivateExpiredSubscriptions = () => apiService.deactivateExpiredSubscriptions();
export const getCoursesAccessibleToUser = (userId: string) => apiService.getCoursesAccessibleToUser(userId);
export const checkUserAccessToCourse = (userId: string, courseId: string) => apiService.checkUserAccessToCourse(userId, courseId);

// Course Access Control Utility Functions
export const isGlobalCourse = (course: ApiCourse | CourseDTO): boolean => {
  return course.courseScope === COURSE_SCOPE.GLOBAL;
};

export const isInstituteCourse = (course: ApiCourse | CourseDTO): boolean => {
  return course.courseScope === COURSE_SCOPE.INSTITUTE_ONLY;
};

export const isRestrictedCourse = (course: ApiCourse | CourseDTO): boolean => {
  return course.courseScope === COURSE_SCOPE.RESTRICTED;
};

export const getCourseAccessBadgeText = (courseScope: CourseScope): string => {
  switch (courseScope) {
    case COURSE_SCOPE.GLOBAL:
      return 'Global';
    case COURSE_SCOPE.INSTITUTE_ONLY:
      return 'Institute Only';
    case COURSE_SCOPE.RESTRICTED:
      return 'Restricted';
    default:
      return 'Unknown';
  }
};

export const getCourseAccessBadgeColor = (courseScope: CourseScope): string => {
  switch (courseScope) {
    case COURSE_SCOPE.GLOBAL:
      return 'blue';
    case COURSE_SCOPE.INSTITUTE_ONLY:
      return 'green';
    case COURSE_SCOPE.RESTRICTED:
      return 'orange';
    default:
      return 'gray';
  }
};

// Super Admin API exports
export const getAllUsersForSuperAdmin = () => apiService.getAllUsersForSuperAdmin();
export const getAllAdminUsers = () => apiService.getAllAdminUsers();
export const getAllSuperAdminUsers = () => apiService.getAllSuperAdminUsers();
export const promoteUserToAdmin = (userId: number) => apiService.promoteUserToAdmin(userId);
export const promoteUserToSuperAdmin = (userId: number) => apiService.promoteUserToSuperAdmin(userId);
export const demoteUserToRegular = (userId: number) => apiService.demoteUserToRegular(userId);
export const forceDeleteUser = (userId: number) => apiService.forceDeleteUser(userId);
export const getSystemStats = () => apiService.getSystemStats();
export const toggleMaintenanceMode = (enabled: boolean) => apiService.toggleMaintenanceMode(enabled);
export const getUserActivityAuditLogs = () => apiService.getUserActivityAuditLogs();

