const availableWords = [
  'hello',
  'your',
  'doctor',
  'danger',
  'want',
  'what',
  'thirsty',
  'eat',
  'feeling',
  'fever',
  'inform',
  'need',
  'please',
  'right',
  'sleep',
  'welcome',
  'toilet',
  'bye',
  'have',
  "take",
  "water",
  "parents",
  "rest",
  "wrong",
  "name",
  "comfortable",
  "help",
  "well",
  "thankyou",
  "problem",
  "i",
  "not",
  "pain",
  "call",
  "go",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"

];

// Use a function to get consistent path across different environments
const getVideoPath = (word, format) => {
  // Start with / to ensure it's from the root of the public directory
  return `/sign-videos/${word}.${format}`;
};

const getVideoFormats = (word) => ({
  mp4: getVideoPath(word, 'mp4'),
  webm: getVideoPath(word, 'webm'),
  gif: getVideoPath(word, 'gif')
});

export const processText = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);

  return words.map(word => {
    // Check if the word is "ME" or in available words list
    const isTranslatable = word.toUpperCase() === "ME" || word.toUpperCase() === "MY" || availableWords.includes(word);
    console.log(`Word: ${word}, Translatable: ${isTranslatable}`);

    return {
      text: word,
      isTranslatable,
      // If word is "ME", use the video for "I", otherwise use the normal video path
      videoSrc: isTranslatable
        ? (word.toUpperCase() === "ME" ? getVideoPath("i", 'mp4') : getVideoPath(word, 'mp4'))
        : undefined,
      videoFormats: isTranslatable
        ? (word.toUpperCase() === "ME" ? getVideoFormats("i") : getVideoFormats(word))
        : undefined
    };
  });
};

export const isWordTranslatable = (word) => {
  return availableWords.includes(word.toLowerCase());
};

export const getVideoSource = (word) => {
  const normalizedWord = word.toLowerCase();
  return isWordTranslatable(normalizedWord)
    ? getVideoPath(normalizedWord, 'mp4')
    : undefined;
};