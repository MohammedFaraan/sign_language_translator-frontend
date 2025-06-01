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
  "ಹಲೋ",
  "ನಿಮ್ಮ",
  "ವೈದ್ಯರು",
  "ಅಪಾಯ",
  "ಬೇಕು",
  "ಏನು",
  "ಬಾಯಾರಿಕೆ",
  "ತಿನ್ನು",
  "ಭಾವನೆ",
  "ಜ್ವರ",
  "ಮಾಹಿತಿ",
  "ಬೇಕು",
  "ದಯವಿಟ್ಟು",
  "ಸರಿ",
  "ನಿದ್ರೆ",
  "ಸ್ವಾಗತ",
  "ಶೌಚಾಲಯ",
  "ಬೈ",
  "ಪಡೆಯಿರಿ",
  "ತೆಗೆದುಕೊಳ್ಳಿ",
  "ನೀರು",
  "ಪೋಷಕರು",
  "ವಿಶ್ರಾಂತಿ",
  "ತಪ್ಪು",
  "ಹೆಸರು",
  "ಆರಾಮದಾಯಕ",
  "ಸಹಾಯ",
  "ಸರಿ",
  "ಧನ್ಯವಾದಗಳು",
  "ಸಮಸ್ಯೆ",
  "ನಾನು",
  "ಇಲ್ಲ",
  "ನೋವು",
  "ಕರೆ",
  "ಹೋಗು",
  "ನನಗೆ ಬಾಯಾರಿಕೆಯಾಗಿದೆ.",
  "ನನಗೆ ತಿನ್ನಬೇಕು.",
  "ನನಗೆ ಮಲಗಬೇಕು.",
  "ನಿನ್ನ ಹೆಸರೇನು?",
  "ನಾನು ಹೋಗುತ್ತಿಲ್ಲ.",
  "ನಾನು ಶೌಚಾಲಯಕ್ಕೆ ಹೋಗಬೇಕು.",
  "ನನಗೆ ನೀರು ಬೇಕು.",
  "ನನಗೆ ಹುಷಾರಿಲ್ಲ.",
  "ನನಗೆ ಜ್ವರ.",
  "ನನಗೆ ನೋವು ಇದೆ.",
  "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.",
  "ದಯವಿಟ್ಟು ನನ್ನ ಹೆತ್ತವರಿಗೆ ತಿಳಿಸಿ.",
  "ನಾನು ವಿಶ್ರಾಂತಿ ಪಡೆಯಲು ಬಯಸುತ್ತೇನೆ.",
  "ನನಗೆ ಸಮಸ್ಯೆ ಇದೆ.",
  "ನಾನು ಅಪಾಯದಲ್ಲಿದ್ದೇನೆ.",
];

// Predefined English sentences for quick selection
const englishSentences = [
  "Hello",
  "Your",
  "Doctor",
  "Danger",
  "Want",
  "What",
  "Thirsty",
  "Eat",
  "Feeling",
  "Fever",
  "Inform",
  "Need",
  "Please",
  "Right",
  "Sleep",
  "Welcome",
  "Toilet",
  "Bye",
  "Have",
  "Take",
  "Water",
  "Parents",
  "Rest",
  "Wrong",
  "Name",
  "Comfortable",
  "Help",
  "Well",
  "Thankyou",
  "Problem",
  "I",
  "Not",
  "Pain",
  "Call",
  "Go",
  "I am thirsty.",
  "I want to eat.",
  "I want to sleep.",
  "What is your name?",
  "I am not going.",
  "I want to go to the toilet.",
  "I want water.",
  "I am not feeling well.",
  "I have a fever.",
  "I have pain.",
  "Please help me.",
  "Please inform my parents.",
  "I want to rest.",
  "I have a problem.",
  "I am in danger.",
];

const SENTENCES_TO_SHOW_DEFAULT = 5;

// Create a direct mapping between Kannada and English sentences
const sentenceMapping = {};
// Assuming the arrays are in the same order with matching translations
kannadaSentences.forEach((sentence, index) => {
  if (index < englishSentences.length) {
    sentenceMapping[sentence] = englishSentences[index];
  }
});

// Helper to normalize Kannada input for direct mapping
function normalizeKannada(text) {
  return text
    .replace(/[\p{P}\p{S}]/gu, "") // Remove punctuation/symbols
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

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
  const [showAllEnglishSentences, setShowAllEnglishSentences] = useState(false);
  const [showAllKannadaSentences, setShowAllKannadaSentences] = useState(false);

  // API base URL - change this to match your Flask server
  const API_BASE_URL = "http://localhost:5000";

  // Clear input text and reset view more state when language changes
  useEffect(() => {
    setInputText("");
    setTranslatedEnglish("");
    setIslGloss("");
    setWords([]);
    setIsDirectMapping(false);
    setShowAllEnglishSentences(false);
    setShowAllKannadaSentences(false);
  }, [selectedLanguage]);

  const handleTranslate = useCallback(
    async (text) => {
      if (!text.trim()) return;

      setIsLoadingTranslation(true);
      setError("");
      setTranslatedEnglish("");
      setIslGloss(""); // Clear previous gloss
      setWords([]); // Clear previous videos
      setIsDirectMapping(false);

      try {
        let textToProcess = text;

        // If Kannada is selected, translate to English first
        if (selectedLanguage === "kannada") {
          try {
            // Normalize input for direct mapping
            const normalizedInput = normalizeKannada(text);
            // Try to find a normalized match in sentenceMapping
            let mappedText = null;
            for (const kannada of Object.keys(sentenceMapping)) {
              if (normalizeKannada(kannada) === normalizedInput) {
                mappedText = sentenceMapping[kannada];
                break;
              }
            }
            if (mappedText) {
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
            console.error(
              "Translation error in handleTranslate:",
              translationError
            );
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
        console.error("Translation error in handleTranslate:", error);
        setError(error.message || "An error occurred during translation");
      } finally {
        setIsLoadingTranslation(false);
      }
    },
    [preloadVideos, getVideoUrl, selectedLanguage, sentenceMapping] // Added sentenceMapping dependency
  );

  // Handle selection of a predefined sentence
  const handleSelectSentence = (sentence) => {
    setInputText(sentence);
    handleTranslate(sentence);
    window.scrollTo({
      top: 100,
      behavior: "smooth", // Optional: 'smooth' or 'auto'
    });
  };

  const englishSentencesToShow = showAllEnglishSentences
    ? englishSentences
    : englishSentences.slice(0, SENTENCES_TO_SHOW_DEFAULT);
  const kannadaSentencesToShow = showAllKannadaSentences
    ? kannadaSentences
    : kannadaSentences.slice(0, SENTENCES_TO_SHOW_DEFAULT);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 container mx-auto px-4 flex flex-col">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Text to Indian Sign Language Translator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert text into Indian Sign Language animations
          </p>
        </header>

        {/* Content Layout: Input on left, Output on right */}
        <div className="flex flex-col md:flex-row gap-8 flex-grow">
          {/* Left Column: Input Sections */}
          <div className="md:w-1/3 flex flex-col gap-4">
            {/* Error message display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
                <AlertCircle className="mr-2" />
                {error}
              </div>
            )}

            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">
                  Select Input Language
                </h2>
              </div>
              <div className="p-4 flex space-x-4 ">
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
            <div className="bg-white rounded-xl shadow-lg">
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
            {selectedLanguage === "english" && englishSentences.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    Available Words & Sentences
                  </h2>
                </div>
                <div className="mx-4">
                  <h4 className="my-2 text-lg font-semibold">Letters:</h4>
                  <p className="text-left font-medium p-2 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 text-gray-800 transition duration-200">
                    A - Z
                  </p>
                </div>
                <h4 className="mt-4 text-lg font-semibold mx-4">
                  Words & Sentences:
                </h4>
                <div className="p-4 pt-2 grid grid-cols-2 gap-2 flex-grow overflow-y-auto">
                  {englishSentencesToShow.map((sentence, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSentence(sentence)}
                      className="text-left font-medium p-2 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 text-gray-800 transition duration-200"
                    >
                      {sentence}
                    </button>
                  ))}
                  {!showAllEnglishSentences &&
                    englishSentences.length > SENTENCES_TO_SHOW_DEFAULT && (
                      <button
                        onClick={() => setShowAllEnglishSentences(true)}
                        className="text-center p-2 bg-gray-100 hover:bg-indigo-100 rounded border border-gray-200 text-indigo-700 font-medium transition duration-200"
                      >
                        View More
                      </button>
                    )}
                  {showAllEnglishSentences &&
                    englishSentences.length > SENTENCES_TO_SHOW_DEFAULT && (
                      <button
                        onClick={() => setShowAllEnglishSentences(false)}
                        className="text-center p-2 bg-gray-100 hover:bg-indigo-100 rounded border border-gray-200 text-indigo-700 font-medium transition duration-200"
                      >
                        View Less
                      </button>
                    )}
                </div>
              </div>
            )}

            {/* Kannada Sentences Quick Selection - Only shown when Kannada is selected */}
            {selectedLanguage === "kannada" && kannadaSentences.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    ಲಭ್ಯವಿರುವ ಪದಗಳು & ವಾಕ್ಯಗಳು
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2 flex-grow overflow-y-auto">
                  {kannadaSentencesToShow.map((sentence, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSentence(sentence)}
                      className="text-left font-medium p-2 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 text-gray-800 transition duration-200"
                    >
                      {sentence}
                    </button>
                  ))}
                  {!showAllKannadaSentences &&
                    kannadaSentences.length > SENTENCES_TO_SHOW_DEFAULT && (
                      <button
                        onClick={() => setShowAllKannadaSentences(true)}
                        className="text-center p-2 bg-gray-100 hover:bg-indigo-100 rounded border border-gray-200 text-indigo-700 font-medium transition duration-200"
                      >
                        View More
                      </button>
                    )}
                  {showAllKannadaSentences &&
                    kannadaSentences.length > SENTENCES_TO_SHOW_DEFAULT && (
                      <button
                        onClick={() => setShowAllKannadaSentences(false)}
                        className="text-center p-2 bg-gray-100 hover:bg-indigo-100 rounded border border-gray-200 text-indigo-700 font-medium transition duration-200"
                      >
                        View Less
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Output Sections */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* Video Player Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col flex-grow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-0">
                  Sign Language Animation
                </h2>
              </div>
              {words.length > 0 ? (
                <VideoPlayer
                  words={words}
                  isLoading={isLoadingTranslation || isLoading}
                />
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500 text-center font-bold p-4 text-xl">
                  <h4>
                    Enter text or select a sentence to see the sign language
                    animation.
                  </h4>
                </div>
              )}
            </div>

            {/* Kannada to English Translation Display - Only shown when Kannada is translated and translation exists */}
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

            {/* ISL Gloss Display Section - Only shown when gloss exists */}
            {islGloss && (
              <div className="bg-white rounded-xl shadow-lg ">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Text_To_ISL;
