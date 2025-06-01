import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";

const STORAGE_KEY = "sign_language_input";

const TextInput = ({
  onTranslate,
  isLoading,
  selectedLanguage = "english",
  inputText = "",
  setInputText,
}) => {
  // Voice input state
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Map selectedLanguage to BCP-47 language code
  const langCode = selectedLanguage === "kannada" ? "kn-IN" : "en-US";

  // When listening stops, update inputText and close popup
  useEffect(() => {
    if (!listening && showVoicePopup && transcript) {
      setInputText(transcript);
      setShowVoicePopup(false);
      resetTranscript();
    }
    // eslint-disable-next-line
  }, [listening]);

  // Clear input text when language changes
  useEffect(() => {
    setInputText("");
    resetTranscript();
  }, [selectedLanguage, resetTranscript, setInputText]);

  // Save to localStorage
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem(STORAGE_KEY, inputText);
    };
    const timeoutId = setTimeout(saveToStorage, 500);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onTranslate(inputText);
    }
  };

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }
    setShowVoicePopup(true);
    resetTranscript();
    SpeechRecognition.startListening({ language: langCode, continuous: false });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setShowVoicePopup(false);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex flex-col relative">
          <textarea
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full  p-4 border border-gray-300 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     resize-none transition duration-200"
            placeholder={
              selectedLanguage === "english"
                ? "Enter your text here to see it in sign language"
                : "ಸೈನ್ ಲ್ಯಾಂಗ್ವೇಜ್‌ನಲ್ಲಿ ನೋಡಲು ನಿಮ್ಮ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ"
            }
            disabled={isLoading}
            aria-label="Text to translate"
            dir={selectedLanguage === "english" ? "ltr" : "auto"}
            rows={2}
          />
        </div>
        <div className="mt-4 flex flex-row justify-between">
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleMicClick}
            className=" right-3 top-3 p-2 rounded-full shadow    text-white 
                      bg-blue-600 hover:bg-blue-700 focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      transition duration-200 "
            aria-label="Start voice input"
            disabled={isLoading}
          >
            <Mic className="w-6 h-6 white" />
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium text-white 
                      bg-blue-600 hover:bg-blue-700 focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      transition duration-200 disabled:opacity-70 
                      disabled:cursor-not-allowed`}
            disabled={isLoading || !inputText.trim()}
            aria-label={isLoading ? "Translating..." : "Translate text"}
          >
            {isLoading
              ? "Translating..."
              : selectedLanguage === "english"
              ? "Translate"
              : "ಅನುವಾದಿಸಿ"}
          </button>
        </div>
      </form>
      {/* Voice recording popup */}
      {showVoicePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <div className="mb-4">
              <Mic className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {selectedLanguage === "english"
                ? "Listening... Please speak now."
                : "ಶ್ರವಣಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಮಾತನಾಡಿ."}
            </div>
            <div className="text-gray-500 mb-4 text-center min-h-[2rem]">
              {transcript}
            </div>
            <button
              onClick={handleStopRecording}
              className="mt-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none"
            >
              <MicOff className="inline w-5 h-5 mr-1" /> Stop Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInput;
