import { Invoice } from '../invoiceGenerator/types/invoice';
import { Notification } from '../user-home-dashboard/types/notification';

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
  id: string;
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
      
      // Handle cases where the response might be empty (e.g., 204 No Content)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else if (contentType && contentType.startsWith("image/")) {
        return await response.blob() as T; // Return blob for image
      } else {
        return await response.text() as T; // Return text for other types like user ID
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

  /**
   * User Login
   * Endpoint: POST localhost:8080/api/public/login
   */
  async login(username: string, password: string): Promise<string> {
    try {
      console.log('Attempting login for user:', username);
      const response = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/public/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      console.log('Login successful for user:', username);
      return response;
    } catch (error) {
      console.error('Login failed for user:', username, error);
      throw error;
    }
  }

  /**
   * Register a new user
   * Endpoint: POST localhost:8080/api/public/register/user
   */
  async registerUser(userData: { firstName: string; lastName: string; email: string; username: string; password: string; }): Promise<void> {
    try {
      console.log('Registering new user:', userData.email);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/public/register/user`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('Successfully registered user');
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  /**
   * Send password reset link
   * Endpoint: POST localhost:8080/api/public/forgot-password
   */
  async sendPasswordResetLink(email: string): Promise<void> {
    try {
      console.log('Sending password reset link to:', email);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/public/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      console.log('Password reset link sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send password reset link to:', email, error);
      throw error;
    }
  }

  /**
   * Get user ID
   * Endpoint: GET localhost:8080/api/user/profile/getuserID
   */
  async getUserId(): Promise<string> {
    try {
      console.log('Fetching user ID...');
      const userId = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/user/profile/getuserID`);
      console.log(`Successfully fetched user ID: ${userId}`);
      return userId;
    } catch (error) {
      console.error('Failed to fetch user ID:', error);
      throw error;
    }
  }

  /**
   * Get user profile by ID
   * Endpoint: GET localhost:8080/api/user/profile/{userID}
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    if (!userId) {
      throw new ApiError('User ID is required to get profile', 400);
    }
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
      const profile = await this.fetchWithErrorHandling<UserProfile>(`${API_BASE_URL}/user/profile/${userId}`);
      console.log(`Successfully fetched profile for user: ${profile.email}`);
      return profile;
    } catch (error) {
      console.error(`Failed to fetch user profile for ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get profile image ID by user ID
   * Endpoint: GET localhost:8080/api/user/profile/getProfileImageID/{userID}
   */
  async getProfileImageId(userId: string): Promise<string> {
    if (!userId) {
      throw new ApiError('User ID is required to get profile image ID', 400);
    }
    try {
      console.log(`Fetching profile image ID for user ID: ${userId}`);
      const imageId = await this.fetchWithErrorHandling<string>(`${API_BASE_URL}/user/profile/getProfileImageID/${userId}`);
      console.log(`Successfully fetched profile image ID: ${imageId}`);
      return imageId;
    } catch (error) {
      console.error(`Failed to fetch profile image ID for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get profile image by image ID
   * Endpoint: GET localhost:8080/api/public/get-image/{profileImageID}
   */
  async getProfileImage(profileImageID: string): Promise<Blob> {
    if (!profileImageID) {
      throw new ApiError('Profile Image ID is required to get image', 400);
    }
    try {
      console.log(`Fetching profile image for ID: ${profileImageID}`);
      const imageBlob = await this.fetchWithErrorHandling<Blob>(`${API_BASE_URL}/public/get-image/${profileImageID}`);
      console.log(`Successfully fetched profile image for ID: ${profileImageID}`);
      return imageBlob;
    } catch (error) {
      console.error(`Failed to fetch profile image for ID ${profileImageID}:`, error);
      throw error;
    }
  }

  /**
   * Update user profile
   * Endpoint: PUT localhost:8080/api/user/profile
   */
  async updateUserProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      console.log('Updating user profile:', profileData);
      const updatedProfile = await this.fetchWithErrorHandling<UserProfile>(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      console.log('Successfully updated profile for user:', updatedProfile.email);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * Endpoint: PUT localhost:8080/api/user/profile/password
   */
  async updatePassword(passwordData: UpdatePasswordRequest): Promise<void> {
    try {
      console.log('Updating user password...');
      const queryParams = new URLSearchParams({
        userID: passwordData.userID,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/user/profile/password?${queryParams.toString()}`, {
        method: 'PUT',
      });
      console.log('Successfully updated password');
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  }

  /**
   * Upload profile image
   * Endpoint: POST localhost:8080/api/user/profile/pic/upload/{userId}
   */
  async uploadProfileImage(userId: string, file: File): Promise<ProfileImageResponse> {
    if (!userId) {
      throw new ApiError('User ID is required for image upload', 400);
    }
    try {
      console.log(`Uploading profile image for user ID: ${userId}`);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/user/profile/pic/upload/${userId}`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header for FormData, browser sets it automatically with boundary
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
      console.log('Successfully uploaded profile image:', result);
      return result;
    } catch (error) {
      console.error(`Failed to upload profile image for user ID ${userId}:`, error);
      throw error;
    }
  }

  // === NOTIFICATION API METHODS ===

  /**
   * Get notifications for a user
   * Endpoint: GET localhost:8080/api/notifications/user/{userId}
   */
  async getNotifications(userId: number): Promise<Notification[]> {
    if (!userId) {
      throw new ApiError('User ID is required to get notifications', 400);
    }
    try {
      console.log(`Fetching notifications for user ID: ${userId}`);
      const notifications = await this.fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications/user/${userId}`);
      console.log(`Successfully fetched ${notifications.length} notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      console.error(`Failed to fetch notifications for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Add a new notification
   * Endpoint: POST localhost:8080/api/notifications?userId={userId}
   */
  async addNotification(notification: Omit<Notification, 'id' | 'timestamp'>, userId: number): Promise<Notification> {
    if (!userId) {
      throw new ApiError('User ID is required to add notification', 400);
    }
    try {
      console.log(`Adding notification for user ID: ${userId}`, notification);
      const newNotification = await this.fetchWithErrorHandling<Notification>(`${API_BASE_URL}/notifications?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(notification),
      });
      console.log('Successfully added notification:', newNotification.title);
      return newNotification;
    } catch (error) {
      console.error(`Failed to add notification for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * Endpoint: PUT localhost:8080/api/notifications/{id}/read
   */
  async markNotificationAsRead(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required to mark as read', 400);
    }
    try {
      console.log(`Marking notification ${id} as read`);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
      });
      console.log('Successfully marked notification as read');
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Mark notification as unread
   * Endpoint: PUT localhost:8080/api/notifications/{id}/unread
   */
  async markNotificationAsUnread(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required to mark as unread', 400);
    }
    try {
      console.log(`Marking notification ${id} as unread`);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}/unread`, {
        method: 'PUT',
      });
      console.log('Successfully marked notification as unread');
    } catch (error) {
      console.error(`Failed to mark notification ${id} as unread:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * Endpoint: PUT localhost:8080/api/notifications/user/{userId}/read-all
   */
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    if (!userId) {
      throw new ApiError('User ID is required to mark all as read', 400);
    }
    try {
      console.log(`Marking all notifications as read for user ID: ${userId}`);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
      });
      console.log('Successfully marked all notifications as read');
    } catch (error) {
      console.error(`Failed to mark all notifications as read for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * Endpoint: DELETE localhost:8080/api/notifications/{id}
   */
  async deleteNotification(id: string): Promise<void> {
    if (!id) {
      throw new ApiError('Notification ID is required for deletion', 400);
    }
    try {
      console.log(`Deleting notification ${id}`);
      await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
      console.log('Successfully deleted notification');
    } catch (error) {
      console.error(`Failed to delete notification ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get notification statistics for a user
   * Endpoint: GET localhost:8080/api/notifications/user/{userId}/stats
   */
  async getNotificationStats(userId: number): Promise<any> {
    if (!userId) {
      throw new ApiError('User ID is required to get notification stats', 400);
    }
    try {
      console.log(`Fetching notification stats for user ID: ${userId}`);
      const stats = await this.fetchWithErrorHandling<any>(`${API_BASE_URL}/notifications/user/${userId}/stats`);
      console.log(`Successfully fetched notification stats for user ${userId}`);
      return stats;
    } catch (error) {
      console.error(`Failed to fetch notification stats for user ID ${userId}:`, error);
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

// New profile related exports
export const getUserId = () => apiService.getUserId();
export const getUserProfile = (userId: string) => apiService.getUserProfile(userId);
export const getProfileImageId = (userId: string) => apiService.getProfileImageId(userId);
export const getProfileImage = (profileImageID: string) => apiService.getProfileImage(profileImageID);
export const updateUserProfile = (profileData: UpdateProfileRequest) => apiService.updateUserProfile(profileData);
export const updatePassword = (passwordData: UpdatePasswordRequest) => apiService.updatePassword(passwordData);
export const uploadProfileImage = (userId: string, file: File) => apiService.uploadProfileImage(userId, file);
export const registerUser = (userData: { firstName: string; lastName: string; email: string; username: string; password: string; }) => apiService.registerUser(userData);
export const sendPasswordResetLink = (email: string) => apiService.sendPasswordResetLink(email);
export const login = (username: string, password: string) => apiService.login(username, password);

// Notification related exports
export const getNotifications = (userId: number) => apiService.getNotifications(userId);
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>, userId: number) => apiService.addNotification(notification, userId);
export const markNotificationAsRead = (id: string) => apiService.markNotificationAsRead(id);
export const markNotificationAsUnread = (id: string) => apiService.markNotificationAsUnread(id);
export const markAllNotificationsAsRead = (userId: number) => apiService.markAllNotificationsAsRead(userId);
export const deleteNotification = (id: string) => apiService.deleteNotification(id);
export const getNotificationStats = (userId: number) => apiService.getNotificationStats(userId);