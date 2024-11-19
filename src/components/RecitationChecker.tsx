import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RecitationCheckerProps {
  originalText: string;
}

export const RecitationChecker = ({ originalText }: RecitationCheckerProps) => {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Error",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  }, [browserSupportsSpeechRecognition]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      checkRecitation();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const checkRecitation = () => {
    // Simple string similarity check
    const similarity = calculateSimilarity(transcript.toLowerCase(), originalText.toLowerCase());
    
    if (similarity > 0.8) {
      toast({
        title: "Excellent!",
        description: "Your recitation matches the verse very well.",
      });
    } else if (similarity > 0.5) {
      toast({
        title: "Good attempt",
        description: "Your recitation is close, but needs some improvement.",
      });
    } else {
      toast({
        title: "Keep practicing",
        description: "Try to match the verse more closely.",
        variant: "destructive",
      });
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  const editDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length];
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <Button
        variant={isListening ? "destructive" : "default"}
        onClick={toggleListening}
        className="w-full"
      >
        {isListening ? (
          <>
            <MicOff className="mr-2 h-4 w-4" /> Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" /> Start Recording
          </>
        )}
      </Button>
      {transcript && (
        <div className="p-4 bg-secondary/10 rounded-lg">
          <p className="font-medium">Your recitation:</p>
          <p className="mt-2">{transcript}</p>
        </div>
      )}
    </div>
  );
};