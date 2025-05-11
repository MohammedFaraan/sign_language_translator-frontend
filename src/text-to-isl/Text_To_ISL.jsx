import React, { useState, useCallback } from "react";
import TextInput from "./components/TextInput/TextInput";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { processText } from "./utils/textProcessing";
import useVideoCache from "./hooks/useVideoCache";
import { AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Text_To_ISL() {
  const [words, setWords] = useState([]);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [islGloss, setIslGloss] = useState("");
  const [error, setError] = useState("");
  const { isLoading, preloadVideos, getVideoUrl } = useVideoCache();

  // API base URL - change this to match your Flask server
  const API_BASE_URL = "http://localhost:5000";

  const handleTranslate = useCallback(
    async (text) => {
      if (!text.trim()) return;

      setIsLoadingTranslation(true);
      setError("");

      try {
        // Send the text to the backend API
        const response = await fetch(`${API_BASE_URL}/api/isl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sentence: text }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to translate text to ISL");
        }

        const data = await response.json();
        const glossText = data.isl_gloss;
        setIslGloss(glossText);

        // Process the received ISL gloss
        const processedWords = processText(glossText);
        await preloadVideos(processedWords);

        const wordsWithCachedUrls = processedWords.map((word) => ({
          ...word,
          videoSrc: word.isTranslatable
            ? getVideoUrl(word.text) || word.videoSrc
            : undefined,
        }));

        setWords(wordsWithCachedUrls);
      } catch (error) {
        console.error("Translation error:", error);
        setError(error.message || "An error occurred during translation");
      } finally {
        setIsLoadingTranslation(false);
      }
    },
    [preloadVideos, getVideoUrl]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Text to Indian Sign Language Translator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert text into Indian Sign Language animations
          </p>
        </header>

        <div className="max-w-4xl mx-auto px-4">
          {/* Error message display */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Text Input Section */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">
                  Enter text to translate
                </h2>
              </div>
              <div className="p-4">
                <TextInput
                  onTranslate={handleTranslate}
                  isLoading={isLoadingTranslation || isLoading}
                />
              </div>
            </div>

            {/* ISL Gloss Display Section */}
            {islGloss && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    ISL Gloss Translation
                  </h2>
                </div>
                <div className="p-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-mono">{islGloss}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Player Section */}
            {words.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    Sign Language Animation
                  </h2>
                </div>
                <VideoPlayer
                  words={words}
                  isLoading={isLoadingTranslation || isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Text_To_ISL;
