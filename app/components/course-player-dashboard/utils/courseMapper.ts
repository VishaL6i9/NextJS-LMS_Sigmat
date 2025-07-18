import { Course, Lesson, Resource, Quiz, Question } from '../types/course';
import { ApiCourse, ApiLesson, ApiResource, ApiQuiz, ApiQuestion } from '@/app/components/services/api';

/**
 * Maps API course data to internal Course type
 */
export const mapApiCourseToCourse = (apiCourse: ApiCourse): Course => {
  return {
    id: apiCourse.id,
    title: apiCourse.name,
    instructor: apiCourse.instructor,
    description: apiCourse.description,
    category: apiCourse.category,
    level: apiCourse.level,
    duration: apiCourse.duration,
    rating: apiCourse.rating,
    studentsEnrolled: apiCourse.studentsEnrolled,
    certificate: apiCourse.certificate,
    currentLessonIndex: 0,
    totalProgress: 0,
    lastAccessed: new Date(),
    lessons: apiCourse.lessons
      .sort((a, b) => a.order - b.order)
      .map(mapApiLessonToLesson),
  };
};

/**
 * Maps API lesson data to internal Lesson type
 */
const mapApiLessonToLesson = (apiLesson: ApiLesson): Lesson => {
  return {
    id: apiLesson.id,
    title: apiLesson.title,
    duration: apiLesson.duration,
    videoUrl: apiLesson.videoUrl,
    completed: false, // This would come from user progress data
    description: apiLesson.description,
    resources: apiLesson.resources?.map(mapApiResourceToResource),
    quiz: apiLesson.quiz ? mapApiQuizToQuiz(apiLesson.quiz) : undefined,
  };
};

/**
 * Maps API resource data to internal Resource type
 */
const mapApiResourceToResource = (apiResource: ApiResource): Resource => {
  return {
    id: apiResource.id,
    title: apiResource.title,
    type: apiResource.type,
    url: apiResource.url,
    size: apiResource.size,
  };
};

/**
 * Maps API quiz data to internal Quiz type
 */
const mapApiQuizToQuiz = (apiQuiz: ApiQuiz): Quiz => {
  return {
    id: apiQuiz.id,
    title: apiQuiz.title,
    questions: apiQuiz.questions.map(mapApiQuestionToQuestion),
    passingScore: apiQuiz.passingScore,
    completed: false, // This would come from user progress data
  };
};

/**
 * Maps API question data to internal Question type
 */
const mapApiQuestionToQuestion = (apiQuestion: ApiQuestion): Question => {
  return {
    id: apiQuestion.id,
    question: apiQuestion.question,
    type: apiQuestion.type,
    options: apiQuestion.options,
    correctAnswer: apiQuestion.correctAnswer,
    explanation: apiQuestion.explanation,
  };
};

/**
 * Maps multiple API courses to internal Course array
 */
export const mapApiCoursesToCourses = (apiCourses: ApiCourse[]): Course[] => {
  return apiCourses.map(mapApiCourseToCourse);
};