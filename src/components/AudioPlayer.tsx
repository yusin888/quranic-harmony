import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  onVerseChange?: (verseNumber: number) => void;
  totalVerses: number;
}

export const AudioPlayer = ({
  audioUrl,
  onVerseChange,
  totalVerses,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevVerse = () => {
    if (currentVerse > 1) {
      const newVerse = currentVerse - 1;
      setCurrentVerse(newVerse);
      onVerseChange?.(newVerse);
    }
  };

  const handleNextVerse = () => {
    if (currentVerse < totalVerses) {
      const newVerse = currentVerse + 1;
      setCurrentVerse(newVerse);
      onVerseChange?.(newVerse);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl || "";
    }
  }, [audioUrl]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevVerse}
            disabled={currentVerse === 1}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextVerse}
            disabled={currentVerse === totalVerses}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <audio ref={audioRef} className="hidden" />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm">Verse {currentVerse}</span>
          <Slider
            value={[currentVerse]}
            min={1}
            max={totalVerses}
            step={1}
            className="flex-1"
            onValueChange={(value) => {
              setCurrentVerse(value[0]);
              onVerseChange?.(value[0]);
            }}
          />
          <span className="text-sm">{totalVerses}</span>
        </div>
      </div>
    </div>
  );
};