import { useState, useRef, useCallback } from 'react';

interface UseVoiceToTextOptions {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

interface UseVoiceToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

export function useVoiceToText({
  onResult,
  onError,
  language = 'en-US',
}: UseVoiceToTextOptions = {}): UseVoiceToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check if Speech Recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Speech recognition is not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      // Clear any previous errors
      setError(null);

      // Create recognition instance
      const SpeechRecognitionCtor: any =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult?.(transcript);
      };

      recognition.onerror = (event: any) => {
        const errorMsg = `Speech recognition error: ${event.error}`;
        setError(errorMsg);
        onError?.(errorMsg);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      const errorMsg = 'Failed to start speech recognition';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsListening(false);
    }
  }, [isSupported, language, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
