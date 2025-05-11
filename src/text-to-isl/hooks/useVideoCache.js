import { useState, useEffect, useRef } from 'react';

const useVideoCache = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef({});
  
  useEffect(() => {
    return () => {
      Object.values(cacheRef.current).forEach(item => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  const preloadVideos = async (words) => {
    setIsLoading(true);
    
    try {
      const translatableWords = words.filter(word => word.isTranslatable && word.videoSrc);
      
      if (translatableWords.length === 0) {
        setIsLoading(false);
        return;
      }
      
      await Promise.all(
        translatableWords.map(async (word) => {
          if (!word.videoSrc) return;
          
          if (cacheRef.current[word.text]) {
            cacheRef.current[word.text].lastAccessed = Date.now();
            return;
          }
          
          try {
            const response = await fetch(word.videoSrc);
            if (!response.ok) throw new Error(`Failed to load video for "${word.text}"`);
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            cacheRef.current[word.text] = {
              blob,
              url,
              lastAccessed: Date.now()
            };
          } catch (error) {
            console.error(`Error loading video for word "${word.text}":`, error);
          }
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const getVideoUrl = (word) => {
    const cachedItem = cacheRef.current[word];
    
    if (cachedItem) {
      cachedItem.lastAccessed = Date.now();
      return cachedItem.url;
    }
    
    return undefined;
  };
  
  return {
    isLoading,
    preloadVideos,
    getVideoUrl
  };
};

export default useVideoCache;