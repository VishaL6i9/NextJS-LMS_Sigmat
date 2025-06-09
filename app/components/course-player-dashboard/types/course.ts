export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  description?: string;
  resources?: Resource[];
  quiz?: Quiz;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'document' | 'code';
  url: string;
  size?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  completed: boolean;
  score?: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  lessons: Lesson[];
  currentLessonIndex: number;
  totalProgress: number;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  rating: number;
  studentsEnrolled: number;
  lastAccessed?: Date;
  certificate?: boolean;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  showControls: boolean;
}

export interface Note {
  id: string;
  lessonId: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}