import React, { useEffect } from "react";

const STORAGE_KEY = "sign_language_input";

const TextInput = ({
  onTranslate,
  isLoading,
  selectedLanguage = "english",
  inputText = "",
  setInputText,
}) => {
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem(STORAGE_KEY, inputText);
    };

    const timeoutId = setTimeout(saveToStorage, 500);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  // Clear input text when language changes
  useEffect(() => {
    setInputText("");
  }, [selectedLanguage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onTranslate(inputText);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex flex-col">
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
        <div className="mt-4 flex justify-end">
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
    </div>
  );
};

export default TextInput;
