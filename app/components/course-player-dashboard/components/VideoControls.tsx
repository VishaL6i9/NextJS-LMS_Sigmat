import React from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings
} from 'lucide-react';
import { VideoPlayerState } from '../types/course';
import { formatTime, calculateProgress } from '../utils/timeUtils';

interface VideoControlsProps {
  state: VideoPlayerState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  state,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [previousVolume, setPreviousVolume] = React.useState(1);

  const progress = calculateProgress(state.currentTime, state.duration);
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * state.duration;
    onSeek(newTime);
  };

  const handleVolumeToggle = () => {
    if (isMuted || state.volume === 0) {
      onVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(state.volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
    onSeek(newTime);
  };

  if (!state.showControls) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 animate-fade-in">
      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 group"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-primary-500 rounded-full transition-all duration-150 group-hover:bg-primary-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          {/* Previous Lesson */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous lesson"
          >
            <SkipBack size={20} />
          </button>

          {/* Skip Back */}
          <button
            onClick={() => handleSkip(-10)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Skip back 10s"
          >
            <div className="relative">
              <SkipBack size={20} />
              <span className="absolute -bottom-1 -right-1 text-xs font-bold">10</span>
            </div>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="p-3 hover:bg-white/20 rounded-full transition-colors bg-white/10"
          >
            {state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => handleSkip(10)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Skip forward 10s"
          >
            <div className="relative">
              <SkipForward size={20} />
              <span className="absolute -bottom-1 -right-1 text-xs font-bold">10</span>
            </div>
          </button>

          {/* Next Lesson */}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next lesson"
          >
            <SkipForward size={20} />
          </button>

          {/* Time Display */}
          <span className="text-sm font-medium">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Volume Control */}
          <div className="flex items-center space-x-2 group">
            <button
              onClick={handleVolumeToggle}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isMuted || state.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : state.volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                onVolumeChange(newVolume);
                setIsMuted(newVolume === 0);
              }}
              className="w-20 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Playback Speed */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center space-x-1"
            >
              <Settings size={20} />
              <span className="text-sm">{state.playbackRate}x</span>
            </button>
            
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 min-w-[80px]">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onPlaybackRateChange(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-white/20 transition-colors ${
                      state.playbackRate === rate ? 'text-primary-400' : ''
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Fullscreen"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};