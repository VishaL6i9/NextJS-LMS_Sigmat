import React, { useState } from 'react';
import { CourseHeader } from './CourseHeader';
import { VideoPlayer } from './VideoPlayer';
import { CourseSidebar } from './CourseSidebar';
import { LessonResources } from './LessonResources';
import { LessonQuiz } from './LessonQuiz';
import { NotesPanel } from './NotesPanel';
import { Course, Note } from '../types/course';
import { useUser } from '@/app/contexts/UserContext';
import { enrollUserInCourse, getUserEnrollments } from '../services/api';
import { Button } from '@/components/ui/button';

interface CourseLearningPageProps {
  course: Course;
  onBack?: () => void;
}

export const CourseLearningPage: React.FC<CourseLearningPageProps> = ({ 
  course: initialCourse, 
  onBack 
}) => {
  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (userProfile?.id && course?.id) {
        setEnrollmentLoading(true);
        setEnrollmentError(null);
        try {
          const enrollments = await getUserEnrollments(userProfile.id);
          const enrolled = enrollments.some(enrollment => enrollment.id === course.id);
          setIsEnrolled(enrolled);
        } catch (err: any) {
          setEnrollmentError(err.message || 'Failed to check enrollment status.');
          console.error('Error checking enrollment:', err);
        } finally {
          setEnrollmentLoading(false);
        }
      }
    };
    checkEnrollment();
  }, [userProfile?.id, course?.id]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<'resources' | 'quiz' | 'notes'>('resources');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const currentLesson = course.lessons[course.currentLessonIndex];

  const handleLessonSelect = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      currentLessonIndex: lessonIndex,
    }));
    setActiveTab('resources');
  };

  const handleLessonComplete = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map((lesson, index) =>
        index === lessonIndex ? { ...lesson, completed: true } : lesson
      ),
    }));
  };

  const handleLessonChange = (lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      currentLessonIndex: lessonIndex,
    }));
    setActiveTab('resources');
  };

  const handleQuizComplete = (score: number) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map((lesson, index) =>
        index === course.currentLessonIndex && lesson.quiz
          ? { 
              ...lesson, 
              quiz: { 
                ...lesson.quiz, 
                completed: true, 
                score 
              } 
            }
          : lesson
      ),
    }));
  };

  const handleAddNote = (content: string, timestamp: number) => {
    const newNote: Note = {
      id: Date.now().toString(),
      lessonId: currentLesson.id,
      timestamp,
      content,
      createdAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleSeekToNote = (timestamp: number) => {
    // This would be handled by the video player
    setCurrentVideoTime(timestamp);
  };

  const handleVideoTimeUpdate = (time: number) => {
    setCurrentVideoTime(time);
  };

  const handleEnroll = async () => {
    if (!userProfile?.id) {
      alert("Please log in to enroll in the course.");
      return;
    }
    if (!course?.id) {
      alert("Course information is missing.");
      return;
    }

    setEnrollmentLoading(true);
    setEnrollmentError(null);
    try {
      // Assuming no specific instructor is selected for direct enrollment here
      await enrollUserInCourse(userProfile.id, course.id);
      setIsEnrolled(true);
      alert("Successfully enrolled in the course!");
    } catch (err: any) {
      setEnrollmentError(err.message || 'Failed to enroll in the course.');
      console.error('Error enrolling:', err);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const hasResources = currentLesson.resources && currentLesson.resources.length > 0;
  const hasQuiz = currentLesson.quiz;

  return (
    <div className="min-h-screen bg-gray-100">
      <CourseHeader course={course} onBack={onBack} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black">
            <VideoPlayer
              course={course}
              onLessonComplete={handleLessonComplete}
              onLessonChange={handleLessonChange}
              onTimeUpdate={handleVideoTimeUpdate}
              seekTime={currentVideoTime}
            />
          </div>

          {/* Enrollment Section */}
          {!isEnrolled && !enrollmentLoading && enrollmentError && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-md m-4">
              {enrollmentError}
            </div>
          )}
          {!isEnrolled && !enrollmentLoading && !enrollmentError && (
            <div className="p-4 bg-white border-t border-gray-200 flex justify-center items-center">
              <Button onClick={handleEnroll} disabled={enrollmentLoading}>
                {enrollmentLoading ? 'Enrolling...' : 'Enroll in Course'}
              </Button>
            </div>
          )}

          {/* Bottom Panel */}
          <div className="h-80 bg-white border-t border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Resources {hasResources && `(${currentLesson.resources?.length})`}
              </button>
              {hasQuiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'quiz'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Quiz {currentLesson.quiz?.completed && '✓'}
                </button>
              )}
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Notes ({notes.filter(note => note.lessonId === currentLesson.id).length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'resources' && (
                <div>
                  {hasResources ? (
                    <LessonResources resources={currentLesson.resources!} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📚</div>
                      <p>No resources available for this lesson</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && hasQuiz && (
                <LessonQuiz
                  quiz={currentLesson.quiz!}
                  onQuizComplete={handleQuizComplete}
                />
              )}

              {activeTab === 'notes' && (
                <NotesPanel
                  notes={notes}
                  currentLessonId={currentLesson.id}
                  currentTime={currentVideoTime}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onSeekToNote={handleSeekToNote}
                />
              )}
            </div>
          </div>
        </div>

        {/* Course Sidebar */}
        <CourseSidebar
          course={course}
          onLessonSelect={handleLessonSelect}
        />
      </div>
    </div>
  );
};