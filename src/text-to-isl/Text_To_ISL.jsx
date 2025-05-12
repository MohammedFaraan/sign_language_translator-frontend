import React, { useState, useCallback, useEffect } from "react";
import TextInput from "./components/TextInput/TextInput";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import { processText } from "./utils/textProcessing";
import useVideoCache from "./hooks/useVideoCache";
import { AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

// Predefined Kannada sentences for quick selection
const kannadaSentences = [
  "ನನಗೆ ಬಾಯಾರಿಕೆಯಾಗಿದೆ.",
  "ನನಗೆ ಊಟ ಬೇಕು.",
  "ನನಗೆ ನಿದ್ರೆ ಬೇಕು.",
  "ನಿಮ್ಮ ಹೆಸರೇನು?",
  "ನಾನು ಹೋಗುತ್ತಿಲ್ಲ.",
  "ನಾನು ಶೌಚಾಲಯಕ್ಕೆ ಹೋಗಬೇಕು.",
  "ನನಗೆ ನೀರು ಬೇಕು.",
  "ನನಗೆ ಬಾಯಾರಿಕೆಯಾಗಿದೆ.",
  "ನನಗೆ ಹುಷಾರಿಲ್ಲ.",
  "ನನಗೆ ಜ್ವರವಿದೆ.",
  "ನನಗೆ ನೋವು ಇದೆ.",
  "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.",
  "ದಯವಿಟ್ಟು ನನ್ನ ಪೋಷಕರಿಗೆ ತಿಳಿಸಿ.",
  "ನಾನು ವಿಶ್ರಾಂತಿ ಪಡೆಯಬೇಕು.",
  "ನನಗೆ ಸ್ನಾನ ಬೇಕು.",
  "ನನಗೆ ಸಮಸ್ಯೆ ಇದೆ.",
  "ನಾನು ಅಪಾಯದಲ್ಲಿದ್ದೇನೆ.",
];

// Predefined English sentences for quick selection
const englishSentences = [
  "I am thirsty.",
  "I want to eat.",
  "I want to sleep.",
  "What is your name?",
  "I am not going.",
  "I want to go to the toilet.",
  "I want water.",
  "I am thirsty.",
  "I am not feeling well.",
  "I have a fever.",
  "I have pain.",
  "Please help me.",
  "Please inform my parents.",
  "I want to rest.",
  "I need a bath.",
  "I have a problem.",
  "I am in danger.",
];

// Create a direct mapping between Kannada and English sentences
const sentenceMapping = {};
// Assuming the arrays are in the same order with matching translations
kannadaSentences.forEach((sentence, index) => {
  if (index < englishSentences.length) {
    sentenceMapping[sentence] = englishSentences[index];
  }
});

// Function to translate text using Google Translate API
const translateText = async (text, sourceLang = "kn", targetLang = "en") => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const response = await axios.get(url);

  // The API returns a complex nested array structure
  let translatedText = "";

  // Extract all translation segments
  if (response.data && Array.isArray(response.data[0])) {
    response.data[0].forEach((segment) => {
      if (segment[0]) {
        translatedText += segment[0];
      }
    });
  }

  console.log("Translated text:", translatedText);
  return translatedText;
};

function Text_To_ISL() {
  const [words, setWords] = useState([]);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [islGloss, setIslGloss] = useState("");
  const [error, setError] = useState("");
  const { isLoading, preloadVideos, getVideoUrl } = useVideoCache();
  const [selectedLanguage, setSelectedLanguage] = useState("english"); // Default to English
  const [translatedEnglish, setTranslatedEnglish] = useState(""); // For storing Kannada→English translation
  const [inputText, setInputText] = useState(""); // State to store input text (new)
  const [isDirectMapping, setIsDirectMapping] = useState(false); // Track if direct mapping was used

  // API base URL - change this to match your Flask server
  const API_BASE_URL = "http://localhost:5000";

  // Clear input text when language changes
  useEffect(() => {
    setInputText("");
    setTranslatedEnglish("");
    setIslGloss("");
    setWords([]);
    setIsDirectMapping(false);
  }, [selectedLanguage]);

  const handleTranslate = useCallback(
    async (text) => {
      if (!text.trim()) return;

      setIsLoadingTranslation(true);
      setError("");
      setTranslatedEnglish("");
      setIsDirectMapping(false);

      try {
        let textToProcess = text;

        // If Kannada is selected, translate to English first
        if (selectedLanguage === "kannada") {
          try {
            // Check if the sentence has a direct mapping
            if (sentenceMapping[text]) {
              const mappedText = sentenceMapping[text];
              setTranslatedEnglish(mappedText);
              textToProcess = mappedText;
              setIsDirectMapping(true);
              console.log("Using direct mapping for accurate translation");
            } else {
              // Fall back to API translation if no direct mapping exists
              const englishText = await translateText(text, "kn", "en");
              setTranslatedEnglish(englishText);
              textToProcess = englishText;
              setIsDirectMapping(false);
              console.log("No direct mapping found, using translation API");
            }
          } catch (translationError) {
            console.error("Translation error:", translationError);
            setError(
              "Failed to translate Kannada to English. Please try again."
            );
            setIsLoadingTranslation(false);
            return;
          }
        }

        // Send the text to the backend API
        const response = await fetch(`${API_BASE_URL}/api/isl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sentence: textToProcess }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to translate text to ISL");
        }

        const data = await response.json();
        const glossText = data.isl_gloss;
        setIslGloss(glossText);
        console.log("ISL Gloss:", glossText);
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
    [preloadVideos, getVideoUrl, selectedLanguage]
  );

  // Handle selection of a predefined sentence
  const handleSelectSentence = (sentence) => {
    setInputText(sentence);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 w-auto">
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

          <div className="flex flex-col px-0 gap-6">
            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-lg w-full">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">
                  Select Input Language
                </h2>
              </div>
              <div className="p-4 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="language"
                    value="english"
                    checked={selectedLanguage === "english"}
                    onChange={() => setSelectedLanguage("english")}
                  />
                  <span className="ml-2">English</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="language"
                    value="kannada"
                    checked={selectedLanguage === "kannada"}
                    onChange={() => setSelectedLanguage("kannada")}
                  />
                  <span className="ml-2">ಕನ್ನಡ (Kannada)</span>
                </label>
              </div>
            </div>

            {/* Text Input Section */}
            <div className="bg-white rounded-xl shadow-lg w-full">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">
                  {selectedLanguage === "english"
                    ? "Enter English text to translate"
                    : "ಅನುವಾದಿಸಲು ಕನ್ನಡ ಪಠ್ಯ ನಮೂದಿಸಿ"}
                </h2>
              </div>
              <div className="p-4">
                <TextInput
                  onTranslate={handleTranslate}
                  isLoading={isLoadingTranslation || isLoading}
                  selectedLanguage={selectedLanguage}
                  inputText={inputText}
                  setInputText={setInputText}
                />
              </div>
            </div>

            {/* English Sentences Quick Selection - Only shown when English is selected */}
            {selectedLanguage === "english" && (
              <div className="bg-white rounded-xl shadow-lg w-full">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    Available Sentences
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {englishSentences.map((sentence, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSentence(sentence)}
                      className="text-left p-2 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 text-gray-800 transition duration-200"
                    >
                      {sentence}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Kannada Sentences Quick Selection - Only shown when Kannada is selected */}
            {selectedLanguage === "kannada" && (
              <div className="bg-white rounded-xl shadow-lg w-full">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    ಲಭ್ಯವಿರುವ ವಾಕ್ಯಗಳು (Available Sentences)
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {kannadaSentences.map((sentence, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSentence(sentence)}
                      className="text-left p-2 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 text-gray-800 transition duration-200"
                    >
                      {sentence}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Kannada to English Translation Display - Only shown when Kannada is translated */}
            {selectedLanguage === "kannada" && translatedEnglish && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    English Translation
                  </h2>
                  {isDirectMapping && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Direct Mapping (High Accuracy)
                    </span>
                  )}
                  {!isDirectMapping && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      API Translation
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800">{translatedEnglish}</p>
                  </div>
                </div>
              </div>
            )}

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
