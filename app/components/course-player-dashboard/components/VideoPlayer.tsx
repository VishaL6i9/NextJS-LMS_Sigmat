import React, { useEffect } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { VideoControls } from './VideoControls';
import { Course } from '../types/course';

interface VideoPlayerProps {
  course: Course;
  onLessonComplete: (lessonIndex: number) => void;
  onLessonChange: (lessonIndex: number) => void;
  onTimeUpdate?: (time: number) => void;
  seekTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  course,
  onLessonComplete,
  onLessonChange,
  onTimeUpdate,
  seekTime,
}) => {
  const { videoRef, state, actions } = useVideoPlayer();
  const currentLesson = course.lessons[course.currentLessonIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load new video when lesson changes
    video.load();
  }, [course.currentLessonIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeUpdate]);

  useEffect(() => {
    if (seekTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Mark current lesson as complete
      if (!currentLesson.completed) {
        onLessonComplete(course.currentLessonIndex);
      }
      
      // Auto-advance to next lesson if available
      if (course.currentLessonIndex < course.lessons.length - 1) {
        onLessonChange(course.currentLessonIndex + 1);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [course.currentLessonIndex, currentLesson.completed, onLessonComplete, onLessonChange]);

  const handlePrevious = () => {
    if (course.currentLessonIndex > 0) {
      onLessonChange(course.currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (course.currentLessonIndex < course.lessons.length - 1) {
      onLessonChange(course.currentLessonIndex + 1);
    }
  };

  const canGoPrevious = course.currentLessonIndex > 0;
  const canGoNext = course.currentLessonIndex < course.lessons.length - 1;

  return (
    <div className="w-full h-full bg-black relative group">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onMouseMove={actions.showControls}
        onMouseEnter={actions.showControls}
        onClick={actions.togglePlay}
      >
        <source src={currentLesson.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Info Overlay */}
      <div className="absolute top-4 left-4 text-white bg-black/50 rounded-lg p-3 animate-fade-in">
        <h3 className="font-semibold text-lg mb-1">{currentLesson.title}</h3>
        <p className="text-sm text-gray-300">
          Lesson {course.currentLessonIndex + 1} of {course.lessons.length}
        </p>
      </div>

      {/* Completion Badge */}
      {currentLesson.completed && (
        <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
          ✓ Completed
        </div>
      )}

      {/* Loading State */}
      {state.duration === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Video Controls */}
      <VideoControls
        state={state}
        onTogglePlay={actions.togglePlay}
        onSeek={actions.seek}
        onVolumeChange={actions.setVolume}
        onPlaybackRateChange={actions.setPlaybackRate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </div>
  );
};