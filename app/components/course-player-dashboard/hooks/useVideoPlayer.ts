import { useState, useRef, useEffect } from 'react';
import { VideoPlayerState } from '../types/course';

export const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isFullscreen: false,
    showControls: true,
  });

  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: video.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: video.duration }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleVolumeChange = () => {
      setState(prev => ({ ...prev, volume: video.volume }));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (state.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const seek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  const setVolume = (volume: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.max(0, Math.min(1, volume));
  };

  const setPlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setState(prev => ({ ...prev, playbackRate: rate }));
  };

  const showControls = () => {
    setState(prev => ({ ...prev, showControls: true }));
    
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (state.isPlaying) {
        setState(prev => ({ ...prev, showControls: false }));
      }
    }, 3000);
  };

  return {
    videoRef,
    state,
    actions: {
      togglePlay,
      seek,
      setVolume,
      setPlaybackRate,
      showControls,
    },
  };
};