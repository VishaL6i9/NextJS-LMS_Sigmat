import { Invoice } from '../invoiceGenerator/types/invoice';
import { Notification } from '../user-home-dashboard/types/notification';

const API_BASE_URL = 'http://localhost:8080/api';

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
}

export interface ApiInstructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
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
  tier: string;
  successUrl: string;
  cancelUrl: string;
  userId: number;
  courseId?: number;
  instructorId?: number;
}

export interface ApiCheckoutSessionResponse {
  url: string;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

export interface ApiInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
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
  timezone: string;
  language: string;
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
  autoRenew: boolean;
  durationMonths: number;
  discountApplied: number;
  paymentReference: string;
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
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
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
    if (!courseId) {
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

  async markNotificationAsUnread(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required to mark as unread', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}/unread`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error(`Failed to mark notification ${id} as unread:`, error);
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

  async deleteNotification(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required for deletion', 400);
    }
    try {
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete notification ${id}:`, error);
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

  // CheckoutController Methods
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

  // SubscriptionController Methods
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const plans = await this.fetchWithErrorHandling<SubscriptionPlan[]>(`${API_BASE_URL}/subscriptions/plans`);
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
}

export const apiService = new ApiService();

export const getUserRoles = () => apiService.getUserRoles();
export const getAllCourses = () => apiService.getAllCourses();
export const getCourseById = (courseId: string) => apiService.getCourseById(courseId);
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
export const requestPasswordReset = (email: string) => apiService.requestPasswordReset(email);
export const resetPassword = (email: string, token: string, newPassword: string) => apiService.resetPassword(email, token, newPassword);
export const login = (username: string, password: string) => apiService.login(username, password);
export const getNotifications = (userId: number) => apiService.getNotifications(userId);
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>, userId: number) => apiService.addNotification(notification, userId);
export const markNotificationAsRead = (id: string) => apiService.markNotificationAsRead(id);
export const markNotificationAsUnread = (id: string) => apiService.markNotificationAsUnread(id);
export const markAllNotificationsAsRead = (userId: number) => apiService.markAllNotificationsAsRead(userId);
export const deleteNotification = (id: string) => apiService.deleteNotification(id);
export const getNotificationStats = (userId: number) => apiService.getNotificationStats(userId);
export const uploadVideo = (file: File, title: string, description: string) => apiService.uploadVideo(file, title, description);
export const getAllVideos = () => apiService.getAllVideos();
export const deleteVideo = (id: string) => apiService.deleteVideo(id);
export const createCertificate = (certificateData: ApiCertificateRequest) => apiService.createCertificate(certificateData);
export const getCertificateById = (id: string) => apiService.getCertificateById(id);
export const getAllCertificates = () => apiService.getAllCertificates();
export const deleteCertificate = (id: string) => apiService.deleteCertificate(id);
export const createCheckoutSession = (sessionData: ApiCheckoutSessionRequest) => apiService.createCheckoutSession(sessionData);
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
export const getSubscriptionPlans = () => apiService.getSubscriptionPlans();
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

