import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import { AlertCircle } from "lucide-react";

const VideoCard = forwardRef(({ word, isActive, onComplete }, ref) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoSource, setVideoSource] = useState("");
  const hasAttemptedPlayRef = useRef(false);

  // Set video source when word changes
  useEffect(() => {
    if (word?.videoSrc) {
      console.log(`Loading video for word: ${word.text}`);
      console.log(`Video source: ${word.videoSrc}`);

      // Reset play attempt flag when word changes
      hasAttemptedPlayRef.current = false;

      // Set the video source
      setVideoSource(word.videoSrc);
      setError(null);
    }
  }, [word]);

  // Handle active state changes (play/pause)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !hasAttemptedPlayRef.current) {
      // Mark that we've attempted to play this video
      hasAttemptedPlayRef.current = true;

      try {
        console.log(`Attempting to play video: ${word?.text}`);
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Error playing video:", err);

            // Only show error for autoplay restrictions
            if (err.name === "NotAllowedError") {
              setError("Autoplay restricted. Click play to start the video.");
            } else {
              setError("Could not play video. Try clicking the play button.");
            }
          });
        }
      } catch (err) {
        console.error("Exception playing video:", err);
      }
    } else if (isActive) {
      // If already attempted play and still active, try again
      video.play().catch((err) => {
        console.error("Retry play error:", err);
      });
    } else {
      video.pause();
    }
  }, [isActive, word]);

  // Set up video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log("Video load started");
      setIsLoading(true);
      setError(null);
    };

    const handleLoaded = () => {
      console.log("Video loaded successfully");
      setIsLoading(false);

      // Try to play immediately when loaded if active
      if (isActive) {
        video.play().catch((err) => {
          console.error("Error playing after load:", err);
        });
      }
    };

    const handleEnded = () => {
      console.log("Video playback ended");
      if (onComplete) onComplete();
    };

    const handleError = (e) => {
      console.error("Video error:", e);
      if (video.error) {
        console.error(`Video error code: ${video.error.code}`);
        console.error(`Video error message: ${video.error.message}`);
      }
      setIsLoading(false);
      setError("Failed to load video");
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [onComplete, isActive]);

  // Clean up video when word changes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, [word]);

  if (!word) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No word selected</p>
      </div>
    );
  }

  if (!word.isTranslatable) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-amber-700 font-medium mb-1">
            No sign available for "{word.text}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-center mb-2">
        <h3 className="text-lg font-medium text-gray-800">
          {word.text.toUpperCase()}
        </h3>
      </div>

      <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoSource}
          muted={true}
          preload="auto"
          playsInline
          controls={false}
          onTimeUpdate={() =>
            setCurrentTime(videoRef.current?.currentTime || 0)
          }
          onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        />
      </div>

      {/* Simple progress bar */}
      <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-blue-600 h-1.5 transition-all"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
});

VideoCard.displayName = "VideoCard";

export default VideoCard;
