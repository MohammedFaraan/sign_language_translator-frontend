import React, { useRef } from 'react';

const ProgressBar = ({ progress, duration, currentTime, onSeek }) => {
  const progressBarRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentClicked = clickX / rect.width;
    const newTime = percentClicked * duration;
    
    onSeek(newTime);
  };

  return (
    <div className="w-full space-y-1">
      <div
        ref={progressBarRef}
        className="h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;