import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BsCameraVideo,
  BsUpload,
  BsInfoCircle,
  BsExclamationTriangle,
  BsRecordCircle,
  BsStopFill,
  BsPlayFill,
  BsCloudUpload,
  BsFolderFill,
  BsTranslate,
  BsArrowRepeat,
  BsCopy,
  BsChevronUp,
  BsChevronDown,
  BsGlobe,
  BsEmojiSmile,
  BsChatSquareText,
  BsTags,
  BsSignpostFill,
} from "react-icons/bs";
import { FaUpload } from "react-icons/fa";

// API base URL - change this to match your Flask server
const API_BASE_URL = "http://localhost:5000";

// Function to translate text using Google Translate API
const translateText = async (text, targetLang = "kn") => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const response = await axios.get(url);

  // The API returns a complex nested array structure
  // The translated text is in the first element of the first array
  let translatedText = "";

  // Extract all translation segments
  if (response.data && Array.isArray(response.data[0])) {
    response.data[0].forEach((segment) => {
      if (segment[0]) {
        translatedText += segment[0];
      }
    });
  }

  return translatedText;
};

function ISL_To_Text() {
  // State management
  const [activeInput, setActiveInput] = useState("webcam");
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [translatedSigns, setTranslatedSigns] = useState({});
  const [totalSigns, setTotalSigns] = useState(0);
  const [uniqueSigns, setUniqueSigns] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAvailableSigns, setShowAvailableSigns] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [islSentence, setIslSentence] = useState(""); // New state for ISL gloss
  const [processingGloss, setProcessingEnglishText] = useState(false); // New state for gloss processing
  const [orderedSigns, setOrderedSigns] = useState([]); // New state for ordered signs
  const [kannadaTranslation, setKannadaTranslation] = useState(""); // New state for Kannada translation
  const [translatingToKannada, setTranslatingToKannada] = useState(false); // State to track Kannada translation progress

  // Refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Request camera access
  const requestCameraAccess = async () => {
    try {
      setErrorMessage("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support camera access");
      }

      // Request higher quality video with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 24 },
          facingMode: "user",
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraPermission(true);
      setStatusMessage("Camera ready. Click 'Start Recording' to begin.");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
      setErrorMessage(error.message || "Unknown camera error");
      setStatusMessage(
        "Camera access denied. Please enable camera permissions and refresh."
      );
    }
  };

  // Test server connection
  const testConnection = async () => {
    setStatusMessage("Testing connection to server...");
    setErrorMessage("");

    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      setStatusMessage("Server connection successful!");
    } catch (error) {
      console.error("Connection error:", error);
      setErrorMessage(
        `Server error: ${error.response?.status || "Connection failed"}`
      );
      setStatusMessage("Server connection failed.");
    }
  };

  // Translate English text to Kannada
  const translateToKannada = async (englishText) => {
    if (!englishText) {
      return;
    }

    setTranslatingToKannada(true);
    setStatusMessage("Translating to Kannada...");

    try {
      const translatedText = await translateText(englishText, "kn");
      setKannadaTranslation(translatedText);
      setStatusMessage("Kannada translation generated successfully!");
    } catch (error) {
      console.error("Translation error:", error);
      setErrorMessage(`Error translating to Kannada: ${error.message}`);
    } finally {
      setTranslatingToKannada(false);
    }
  };

  // Generate ISL gloss from detected signs
  const generateEnglishText = async (signs, ordered) => {
    if (!signs || Object.keys(signs).length === 0) {
      setErrorMessage("No signs detected to generate sentence");
      return;
    }

    setProcessingEnglishText(true);
    setStatusMessage("Generating sentence...");
    setKannadaTranslation(""); // Clear previous Kannada translation

    try {
      // Use the ordered list of signs instead of sorting by frequency
      // This preserves the temporal ordering which is crucial for correct meaning
      const gloss = ordered.join(" ").toUpperCase();
      console.log(gloss);

      if (ordered.length > 1) {
        // Send the detected signs to the /api/isl endpoint
        const response = await axios.post(`${API_BASE_URL}/api/english`, {
          gloss: gloss,
        });

        if (response.data && response.data.english_text) {
          setIslSentence(response.data.english_text);
          setStatusMessage("English Text generated successfully!");

          // Now translate the English text to Kannada
          await translateToKannada(response.data.english_text);
        } else {
          setErrorMessage("Received invalid response from the Server");
        }
      } else {
        setIslSentence(gloss);
        setStatusMessage("English Text generated successfully!");

        // Also translate single words to Kannada
        await translateToKannada(gloss);
      }
    } catch (error) {
      console.error("Server error:", error);
      setErrorMessage(
        `Error generating ISL sentence: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setProcessingEnglishText(false);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) {
      setErrorMessage("No camera stream available");
      return;
    }

    recordedChunksRef.current = [];
    let options;

    // Set up high quality recording options
    // Try to use webm with VP9 codec for better quality first
    try {
      options = {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 2500000, // 2.5 Mbps for high quality
      };
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    } catch (e) {
      try {
        options = {
          mimeType: "video/webm;codecs=vp8",
          videoBitsPerSecond: 2000000, // 2 Mbps
        };
        mediaRecorderRef.current = new MediaRecorder(
          streamRef.current,
          options
        );
      } catch (e) {
        try {
          options = {
            mimeType: "video/webm",
            videoBitsPerSecond: 1500000, // 1.5 Mbps fallback
          };
          mediaRecorderRef.current = new MediaRecorder(
            streamRef.current,
            options
          );
        } catch (e) {
          setErrorMessage(
            "MediaRecorder not supported with any available format"
          );
          return;
        }
      }
    }

    setErrorMessage("");

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onerror = (event) => {
      setErrorMessage(`MediaRecorder error: ${event.error}`);
      stopRecording();
    };

    // Increase data collection frequency for smoother video
    mediaRecorderRef.current.start(500); // Collect data every 500ms for smoother video
    setIsRecording(true);
    setStatusMessage("Recording in high quality...");

    // Reset results
    setTranslatedSigns({});
    setTotalSigns(0);
    setUniqueSigns(0);
    setIslSentence(""); // Reset ISL gloss
    setKannadaTranslation(""); // Reset Kannada translation
    setOrderedSigns([]); // Reset ordered signs

    // Start timer
    setRecordingTimer(0);
    timerRef.current = setInterval(() => {
      setRecordingTimer((prev) => prev + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    clearInterval(timerRef.current);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setStatusMessage(
        "Recording stopped. Click 'Process Recording' to analyze."
      );
      setIsRecording(false);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Process and upload video data
  const processVideoData = async (videoData, filename) => {
    if (!videoData || !videoData.size) {
      setErrorMessage("No video data available to process");
      return;
    }

    // Create form data with the video
    const formData = new FormData();
    formData.append("video", videoData, filename || "recording.webm");

    // Reset and show progress
    setUploadProgress(0);
    setIsProcessing(true);
    setErrorMessage("");
    setIslSentence(""); // Reset ISL gloss
    setOrderedSigns([]); // Reset ordered signs
    setStatusMessage("Uploading and processing video...");

    try {
      // Use axios for upload with progress tracking
      const response = await axios.post(
        `${API_BASE_URL}/api/process-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            setStatusMessage(`Uploading: ${percentCompleted}%`);
          },
        }
      );

      // Update state with results
      const data = response.data;
      console.log("Processing results:", data);

      // Check if signs were detected
      if (
        !data.detected_signs ||
        Object.keys(data.detected_signs).length === 0
      ) {
        setErrorMessage("No signs were detected in the video");
        setStatusMessage("Processing complete, but no signs were detected");
        setTranslatedSigns({});
        setTotalSigns(0);
        setUniqueSigns(0);
        setOrderedSigns([]);
      } else {
        setTranslatedSigns(data.detected_signs || {});
        setTotalSigns(data.total_signs || 0);
        setUniqueSigns(data.unique_signs || 0);
        setOrderedSigns(data.ordered_signs || []); // Store ordered signs

        // Generate ISL gloss from detected signs
        await generateEnglishText(data.detected_signs, data.ordered_signs);

        setStatusMessage("Processing complete!");
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Properly handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage(
          `Server error: ${error.response.status} ${error.response.statusText}`
        );
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No response from server. Is the server running?");
      } else {
        // Something happened in setting up the request
        setErrorMessage(`Error: ${error.message}`);
      }

      setStatusMessage("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload recorded video
  const uploadRecordedVideo = () => {
    if (recordedChunksRef.current.length === 0) {
      setErrorMessage("No recording available");
      return;
    }

    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    processVideoData(blob, "recording.webm");
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process uploaded file
  const processFile = (file) => {
    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum size is 100MB.");
      return;
    }

    // Check file type
    const validTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/avi",
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file type. Please upload MP4, MOV, WEBM or AVI files."
      );
      return;
    }

    processVideoData(file, file.name);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Copy signs to clipboard
  const copyText = () => {
    if (Object.keys(translatedSigns).length > 0) {
      try {
        let text = Object.entries(translatedSigns)
          .map(([sign, count]) => `${sign}: ${count} time(s)`)
          .join("\n");

        if (islSentence) {
          text += "\n\nEnglish Text:\n" + islSentence;
        }

        if (kannadaTranslation) {
          text += "\n\nKannada Translation:\n" + kannadaTranslation;
        }

        navigator.clipboard.writeText(text);
        setStatusMessage("Signs and translations copied to clipboard");

        // Reset status message after 2 seconds
        setTimeout(() => {
          setStatusMessage(
            cameraPermission ? "Camera ready" : "Please enable camera"
          );
        }, 2000);
      } catch (error) {
        console.error("Failed to copy text:", error);
        setErrorMessage("Failed to copy text to clipboard");
      }
    }
  };

  // Reset everything
  const resetAll = () => {
    setTranslatedSigns({});
    setTotalSigns(0);
    setUniqueSigns(0);
    setIsProcessing(false);
    setUploadProgress(0);
    setStatusMessage(
      cameraPermission ? "Camera ready" : "Please enable camera"
    );
    setRecordingTimer(0);
    setErrorMessage("");
    setIslSentence(""); // Reset ISL gloss
    setProcessingEnglishText(false);
    setOrderedSigns([]); // Reset ordered signs
    setKannadaTranslation(""); // Reset Kannada translation

    // Clear any ongoing intervals
    clearInterval(timerRef.current);

    // Reset recording state
    if (isRecording) {
      stopRecording();
    }
    recordedChunksRef.current = [];
  };

  // Initialize camera when component mounts and input is webcam
  useEffect(() => {
    if (activeInput === "webcam") {
      requestCameraAccess();
    } else {
      // Stop camera if switching to upload
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
    }

    return () => {
      // Clean up video stream when component unmounts
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }

      // Clear any ongoing intervals
      clearInterval(timerRef.current);
    };
  }, [activeInput]);

  const words = [
    "Bye",
    "Call",
    "Danger",
    "Eat",
    "Feeling",
    "Fever",
    "Have",
    "Hello",
    "Help",
    "I",
    "Name",
    "Not",
    "Please",
    "Sleep",
    "Thirsty",
    "Toilet",
    "Want",
    "What",
    "You",
    "Your",
  ];
  const sentences = [
    "I fever have (I have a fever).",
    "Help Me Please (Please help me).",
    "You feeling what? (What are you feeling?).",
    "I toilet want. (I want to go to the toilet).",
    "Your name what? (What is your name?).",
    "I Want eat (I want to eat).",
    "I not eat. (I don't want to eat).",
    "I thirsty. (I am thirsty).",
    "I Danger (Please help, it’s dangerous).",
    "I sleep want. (I want to sleep).",
    "Bye you. (Goodbye).",
    "You Danger (Are you in danger).",
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container flex flex-col mx-auto pt-24 pb-16">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Indian Sign Language to English Translator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert sign language gestures into English text in real-time
          </p>
        </header>

        <div className="max-w-6xl mx-auto px-4">
          {/* Input Method Selection */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full shadow-md p-1 inline-flex">
              <button
                className={`px-6 py-2 rounded-full font-medium text-sm transition duration-300 flex items-center ${
                  activeInput === "webcam"
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveInput("webcam")}
              >
                <BsCameraVideo className="mr-2" />
                Use Webcam
              </button>
              <button
                className={`px-6 py-2 rounded-full font-medium text-sm transition duration-300 flex items-center ${
                  activeInput === "upload"
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveInput("upload");
                  setErrorMessage("");
                }}
              >
                <FaUpload className="mr-2" />
                Upload Video
              </button>
            </div>
          </div>

          {/* API URL Display/Warning */}
          {/* <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative flex items-center">
            <BsInfoCircle className="mr-2" />
            <span>Using API at: {API_BASE_URL}</span>
            <button
              className="ml-3 px-3 py-1 text-xs bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
              onClick={testConnection}
            >
              Test API Connection
            </button>
          </div> */}

          {/* Error message display */}
          {errorMessage && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
              <BsExclamationTriangle className="mr-2" />
              {errorMessage}
            </div>
          )}

          {/* Camera/Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main input area */}
            <div className="lg:col-span-2">
              {activeInput === "webcam" ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div
                    className="bg-gray-900 relative"
                    style={{
                      aspectRatio: "16/9",
                      maxHeight: "80vh", // Limit height to 80% of viewport height
                      minHeight: "480px", // Ensure minimum height
                    }}
                  >
                    {cameraPermission === false && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-gray-800 bg-opacity-90 p-4 text-center">
                        <BsExclamationTriangle className="text-yellow-400 text-4xl mb-3" />
                        <h3 className="font-bold mb-2">
                          Camera Access Required
                        </h3>
                        <p className="mb-4">
                          Please allow camera access to use the sign language
                          translator.
                        </p>
                        <button
                          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300"
                          onClick={requestCameraAccess}
                        >
                          <BsCameraVideo className="mr-2" />
                          Enable Camera
                        </button>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-contain"
                    ></video>
                    {isRecording && (
                      <div className="absolute top-0 left-0 m-3 flex items-center bg-red-600 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                        <BsRecordCircle className="mr-2" />
                        Recording {formatTime(recordingTimer)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-center border-t border-gray-200">
                    <div className="text-sm text-gray-600 w-80">
                      {statusMessage}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`flex items-center px-4 py-2 rounded-lg font-medium text-white transition duration-300 ${
                          isRecording
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } ${
                          !cameraPermission
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={toggleRecording}
                        disabled={!cameraPermission}
                      >
                        {isRecording ? (
                          <>
                            <BsStopFill className="mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <BsPlayFill className="mr-2" />
                            Start Recording
                          </>
                        )}
                      </button>
                      <button
                        className={`flex items-center px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300 ${
                          isRecording || recordedChunksRef.current.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={uploadRecordedVideo}
                        disabled={
                          isRecording || recordedChunksRef.current.length === 0
                        }
                      >
                        <BsUpload className="mr-2" />
                        Process Recording
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 border-dashed ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300"
                  } transition-colors duration-200`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ minHeight: "300px" }}
                >
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                    <BsCloudUpload className="text-5xl text-indigo-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Drag & Drop your video file here
                    </h3>
                    <p className="text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <button
                      className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <BsFolderFill className="mr-2" />
                      Browse Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="video/mp4,video/quicktime,video/webm,video/avi"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats: MP4, MOV, WEBM, AVI (Max size: 100MB)
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {statusMessage || "Ready to process your file"}
                    </div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 bg-white rounded-xl shadow-lg">
                  <div className="p-4">
                    <p className="text-center mb-2">Processing video...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center mt-1">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                </div>
              )}

              {processingGloss && (
                <div className="mt-4 bg-white rounded-xl shadow-lg">
                  <div className="p-3 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-4 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
                    <span>Generating text translation...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Results & Metrics */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    Detected Signs
                  </h2>
                </div>

                {/* Results Area */}
                <div className="p-4 flex-grow flex flex-col">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
                      <p className="text-gray-600">
                        Processing sign language...
                      </p>
                    </div>
                  ) : Object.keys(translatedSigns).length > 0 ? (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between mb-3">
                        <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                          Total signs: {totalSigns}
                        </span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                          Unique signs: {uniqueSigns}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded p-3 flex-grow mb-3 overflow-auto">
                        <ul className="space-y-2">
                          {Object.entries(translatedSigns)
                            .sort(([, a], [, b]) => b - a) // Sort by frequency
                            .map(([sign, count], index) => (
                              <li
                                key={index}
                                className="bg-white p-2 rounded shadow-sm"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">{sign}</span>
                                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {count} time{count !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                      <BsInfoCircle className="text-4xl mb-3 text-indigo-300 opacity-50" />
                      <p>Detected signs will appear here</p>
                      <p className="text-sm mt-2">
                        Start recording or upload a video to begin
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300"
                      onClick={resetAll}
                    >
                      <BsArrowRepeat className="mr-2" />
                      Reset
                    </button>
                    <button
                      className={`flex items-center justify-center flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300 ${
                        Object.keys(translatedSigns).length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={copyText}
                      disabled={Object.keys(translatedSigns).length === 0}
                    >
                      <BsCopy className="mr-2" />
                      Copy Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New ISL Gloss Card */}
          {islSentence && (
            <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white p-3">
                <h3 className="text-lg font-medium flex items-center">
                  <BsTranslate className="mr-2" />
                  Generated English Text
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-lg mb-0">{islSentence}</p>
                </div>
              </div>
            </div>
          )}

          {/* New Kannada Translation Card */}
          {kannadaTranslation && (
            <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-amber-600 text-white p-3">
                <h3 className="text-lg font-medium flex items-center">
                  <BsGlobe className="mr-2" />
                  Kannada Translation
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-lg mb-0" lang="kn">
                    {kannadaTranslation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show loading indicator when translating to Kannada */}
          {translatingToKannada && (
            <div className="mt-4 bg-white rounded-xl shadow-lg">
              <div className="p-3 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-4 border-amber-500 border-t-transparent rounded-full mr-2"></div>
                <span>Translating to Kannada...</span>
              </div>
            </div>
          )}

          {/* Available Signs Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <BsSignpostFill className="text-2xl" />
                <h2 className="text-lg font-semibold m-0">
                  Available Indian Sign Languages (ಲಭ್ಯವಿರುವ ಭಾರತೀಯ ಸಂಕೇತ
                  ಭಾಷೆಗಳು)
                </h2>
              </div>
              <button
                className="flex items-center space-x-1 bg-teal-500 hover:bg-teal-700 transition-colors duration-300 px-4 py-2 text-sm font-medium rounded-lg"
                onClick={() => setShowAvailableSigns(!showAvailableSigns)}
              >
                {showAvailableSigns ? <BsChevronUp /> : <BsChevronDown />}
                <span>{showAvailableSigns ? "Hide" : "Show"} Signs</span>
              </button>
            </div>

            {/* Content */}
            {showAvailableSigns && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Available Words */}
                  <div className="bg-teal-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center text-teal-600 text-2xl mb-4">
                      <BsTags className="mr-3" />
                      <span className="font-semibold text-xl">
                        Available Words
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      {[
                        "Bye",
                        "Call",
                        "Danger",
                        "Eat",
                        "Feeling",
                        "Fever",
                        "Have",
                        "Hello",
                        "Help",
                        "I",
                        "Name",
                        "Not",
                        "Please",
                        "Sleep",
                        "Thirsty",
                        "Toilet",
                        "Want",
                        "What",
                        "You",
                        "Your",
                      ].map((word) => (
                        <li
                          key={word}
                          className="flex items-center space-x-2 hover:bg-teal-100 p-2 rounded transition"
                        >
                          <BsEmojiSmile className="text-teal-400" />
                          <span>{word}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Available Sentences */}
                  <div className="bg-teal-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center text-teal-600 text-2xl mb-4">
                      <BsChatSquareText className="mr-3" />
                      <span className="font-semibold text-xl">
                        Available Sentences
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      {[
                        ["I fever have", "I have a fever"],
                        ["Help Me Please", "Please help me"],
                        ["You feeling what?", "What are you feeling?"],
                        ["I toilet want", "I want to go to the toilet"],
                        ["Your name what?", "What is your name?"],
                        ["I want eat", "I want to eat"],
                        ["I not eat", "I don't want to eat"],
                        ["I thirsty", "I am thirsty"],
                        ["I danger", "Please help, it’s dangerous"],
                        ["I sleep want", "I want to sleep"],
                        ["Bye you", "Goodbye"],
                        ["You danger", "Are you in danger?"],
                      ].map(([gloss, eng]) => (
                        <li
                          key={gloss}
                          className="flex items-start space-x-2 hover:bg-teal-100 p-2 rounded transition"
                        >
                          <BsEmojiSmile className="mt-1 text-teal-400" />
                          <div>
                            <span className="font-medium">{gloss}</span>
                            <span className="text-gray-500"> — {eng}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-0">
                How to Use This Translator (ಈ ಅನುವಾದಕವನ್ನು ಹೇಗೆ ಬಳಸುವುದು)
              </h2>
              <button
                className="flex items-center bg-transparent border border-white text-white hover:bg-indigo-700 px-3 py-1 text-sm rounded transition duration-300"
                onClick={() => setShowTutorial(!showTutorial)}
              >
                {showTutorial ? (
                  <BsChevronUp className="mr-1" />
                ) : (
                  <BsChevronDown className="mr-1" />
                )}
                {showTutorial ? "Hide" : "Show"} Tutorial
              </button>
            </div>

            {showTutorial && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsCameraVideo className="mr-2" />
                      Using Webcam
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      <li>Allow camera access when prompted</li>
                      <li>Position yourself in frame with good lighting</li>
                      <li>Click "Start Recording" to begin translation</li>
                      <li>Perform sign language gestures clearly</li>
                      <li className="mb-2">
                        Click "Stop Recording" when finished
                      </li>
                      <li>
                        Click "Process Recording" to analyze your gestures
                      </li>
                    </ol>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsUpload className="mr-2" />
                      Using File Upload
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      <li>Switch to "Upload Video" tab</li>
                      <li>Drag and drop your file or click to browse</li>
                      <li>Wait for the processing to complete</li>
                      <li>View your detected signs and ISL gloss</li>
                      <li>Copy the results if needed</li>
                    </ol>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsInfoCircle className="mr-2" />
                      Tips for Better Results
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Ensure good lighting conditions</li>
                      <li>Position yourself against a plain background</li>
                      <li>Make clear, deliberate hand gestures</li>
                      <li>Keep your hands within the camera frame</li>
                      <li>Avoid rapid movements for better accuracy</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsCameraVideo className="mr-2" />
                      ವೆಬ್‌ಕ್ಯಾಮ್ ಬಳಸುವುದು
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      <li>ಪ್ರಾಂಪ್ಟ್ ಮಾಡಿದಾಗ ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ</li>
                      <li>ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಫ್ರೇಮ್‌ನಲ್ಲಿ ನಿಮ್ಮನ್ನು ಇರಿಸಿ</li>

                      <li>
                        ಅನುವಾದವನ್ನು ಪ್ರಾರಂಭಿಸಲು "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ" ಕ್ಲಿಕ್
                        ಮಾಡಿ
                      </li>

                      <li>ಸಂಜ್ಞೆ ಭಾಷೆಯ ಸನ್ನೆಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನಿರ್ವಹಿಸಿ</li>

                      <li className="mb-2">
                        ಮುಗಿದ ನಂತರ "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ
                      </li>

                      <li>
                        ನಿಮ್ಮ ಸನ್ನೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು "ಪ್ರಕ್ರಿಯೆ ರೆಕಾರ್ಡಿಂಗ್"
                        ಕ್ಲಿಕ್ ಮಾಡಿ
                      </li>
                    </ol>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsUpload className="mr-2" />
                      ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಬಳಸಿ
                    </div>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      <li>"ಅಪ್‌ಲೋಡ್ ವೀಡಿಯೊ" ಟ್ಯಾಬ್‌ಗೆ ಬದಲಾಯಿಸಿ</li>
                      <li>
                        ನಿಮ್ಮ ಫೈಲ್ ಅನ್ನು ಎಳೆಯಿರಿ ಮತ್ತು ಬಿಡಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು
                        ಕ್ಲಿಕ್ ಮಾಡಿ
                      </li>

                      <li>ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ಕಾಯಿರಿ</li>
                      <li>
                        ನಿಮ್ಮ ಪತ್ತೆಯಾದ ಚಿಹ್ನೆಗಳು ಮತ್ತು ISL ಹೊಳಪನ್ನು ವೀಕ್ಷಿಸಿ
                      </li>
                      <li>ಅಗತ್ಯವಿದ್ದರೆ ಫಲಿತಾಂಶಗಳನ್ನು ನಕಲಿಸಿ</li>
                    </ol>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-indigo-600 text-xl mb-2 flex items-center">
                      <BsInfoCircle className="mr-2" />
                      ಉತ್ತಮ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ ಸಲಹೆಗಳು
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>ಉತ್ತಮ ಬೆಳಕಿನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ</li>

                      <li>ಸರಳ ಹಿನ್ನೆಲೆಯ ವಿರುದ್ಧ ನಿಮ್ಮನ್ನು ಇರಿಸಿ</li>
                      <li>ಸ್ಪಷ್ಟ, ಉದ್ದೇಶಪೂರ್ವಕ ಕೈ ಸನ್ನೆಗಳನ್ನು ಮಾಡಿ</li>

                      <li>ಕ್ಯಾಮೆರಾ ಚೌಕಟ್ಟಿನೊಳಗೆ ನಿಮ್ಮ ಕೈಗಳನ್ನು ಇರಿಸಿ</li>

                      <li>ಉತ್ತಮ ನಿಖರತೆಗಾಗಿ ತ್ವರಿತ ಚಲನೆಗಳನ್ನು ತಪ್ಪಿಸಿ</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ISL_To_Text;
