import React, { useState, useEffect, useRef, useCallback } from "react";
import VideoCard from "./VideoCard";
import { Play, Pause, SkipForward, SkipBack, AlertCircle } from "lucide-react";

const VideoPlayer = ({ words, isLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showNotTranslatableMessage, setShowNotTranslatableMessage] =
    useState(false);
  const messageTimerRef = useRef(null);

  // Reset state when words change
  useEffect(() => {
    if (words && words.length > 0) {
      setActiveIndex(0);
      setIsPlaying(true);
      setShowNotTranslatableMessage(false);

      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
        messageTimerRef.current = null;
      }

      // Check if the first word is not translatable
      const firstWord = words[0];
      if (firstWord && !firstWord.isTranslatable) {
        setShowNotTranslatableMessage(true);
      }
    }
  }, [words]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // Handle non-translatable words
  useEffect(() => {
    if (!words || words.length === 0 || activeIndex >= words.length) return;

    const currentWord = words[activeIndex];
    if (
      currentWord &&
      !currentWord.isTranslatable &&
      !showNotTranslatableMessage
    ) {
      setShowNotTranslatableMessage(true);

      // Only set a timeout to move to next word if there are more words
      if (words.length > 1 && activeIndex < words.length - 1) {
        if (messageTimerRef.current) {
          clearTimeout(messageTimerRef.current);
        }

        messageTimerRef.current = setTimeout(() => {
          setShowNotTranslatableMessage(false);
          handleNextWord();
        }, 2000);
      }
    } else if (currentWord && currentWord.isTranslatable) {
      // Auto-play the current word when it changes
      setIsPlaying(true);
    }
  }, [activeIndex, words, showNotTranslatableMessage]);

  // Navigation handlers
  const handleNextWord = useCallback(() => {
    if (!words || activeIndex >= words.length - 1) return;

    setActiveIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      // Check if next word is not translatable
      if (nextIndex < words.length) {
        const nextWord = words[nextIndex];
        if (nextWord && !nextWord.isTranslatable) {
          setShowNotTranslatableMessage(true);

          // Only set timeout if there are more words after this one
          if (nextIndex < words.length - 1) {
            if (messageTimerRef.current) {
              clearTimeout(messageTimerRef.current);
            }

            messageTimerRef.current = setTimeout(() => {
              setShowNotTranslatableMessage(false);
              handleNextWord();
            }, 2000);
          }
        } else {
          // Auto-play when navigating to the next word
          setIsPlaying(true);
        }
      }

      return nextIndex;
    });
  }, [activeIndex, words]);

  const handlePreviousWord = useCallback(() => {
    if (!words || activeIndex <= 0) return;
    // Auto-play when navigating to the previous word
    setIsPlaying(true);
    setActiveIndex((prevIndex) => prevIndex - 1);
  }, [activeIndex, words]);

  // Handle video completion
  const handleVideoComplete = useCallback(() => {
    // Only move to next word if there are more words
    if (words && words.length > 1 && activeIndex < words.length - 1) {
      handleNextWord();
    }
  }, [handleNextWord, words, activeIndex]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="ml-4 text-gray-600">Loading animations...</p>
      </div>
    );
  }

  // Empty state
  if (!words || words.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 h-64 text-center">
        <p className="text-gray-500">
          Enter some text and click "Translate" to see sign language animations.
        </p>
      </div>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, words.length - 1);
  const currentWord = words[safeActiveIndex];

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center p-6 h-64 text-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
          <p className="text-gray-600">
            Something went wrong. Please try translating again.
          </p>
        </div>
      </div>
    );
  }

  // Check if there's only one word and it's not translatable
  const singleNonTranslatableWord =
    words.length === 1 && !currentWord.isTranslatable;

  return (
    <div className="flex flex-col p-4">
      {/* Word count indicator */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Translation</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Word {safeActiveIndex + 1} of {words.length}
        </div>
      </div>

      {/* Video Display */}
      <div className="flex-grow flex items-center justify-center mb-5">
        {showNotTranslatableMessage || singleNonTranslatableWord ? (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-amber-700 font-medium mb-2">
              No sign available for "{currentWord ? currentWord.text : ""}"
            </p>
            {!singleNonTranslatableWord && (
              <p className="text-amber-600 text-sm">Moving to next word...</p>
            )}
          </div>
        ) : (
          <VideoCard
            key={`${currentWord.text}-${safeActiveIndex}`}
            word={currentWord}
            isActive={isPlaying}
            onComplete={handleVideoComplete}
          />
        )}
      </div>

      {/* Controls - Only show if there are translatable words or multiple words */}
      {(!singleNonTranslatableWord ||
        words.some((word) => word.isTranslatable)) && (
        <div className="flex justify-center space-x-4 py-2">
          <button
            onClick={handlePreviousWord}
            className={`p-3 rounded-full ${
              activeIndex > 0
                ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
            aria-label="Previous word"
            disabled={activeIndex <= 0}
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!currentWord.isTranslatable}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleNextWord}
            className={`p-3 rounded-full ${
              activeIndex < words.length - 1
                ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
            aria-label="Next word"
            disabled={activeIndex >= words.length - 1}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
