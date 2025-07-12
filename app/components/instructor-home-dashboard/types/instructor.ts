export interface Course {
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
  instructors: Instructor[];
  enrolledStudents: number;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  status: 'active' | 'draft' | 'archived';
  startDate: Date;
  endDate: Date;
  thumbnail?: string;
}

export interface Instructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  dateOfJoining: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  submissions: number;
  graded: number;
  averageScore: number;
  status: 'draft' | 'published' | 'closed';
  type: 'quiz' | 'project' | 'essay' | 'exam';
}

export interface InstructorStats {
  totalStudents: number;
  activeCourses: number;
  pendingGrades: number;
  totalAssignments: number;
  averageGrade: number;
  completionRate: number;
  thisWeekSubmissions: number;
  monthlyGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: 'submission' | 'enrollment' | 'grade' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  studentName?: string;
  courseName?: string;
  priority: 'low' | 'medium' | 'high';
}