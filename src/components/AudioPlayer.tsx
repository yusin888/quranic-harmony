import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AudioPlayerProps {
  audioUrl?: string;
  onVerseChange?: (verseNumber: number) => void;
  totalVerses: number;
  currentVerse: number;
}

export const AudioPlayer = ({
  audioUrl,
  onVerseChange,
  totalVerses,
  currentVerse,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!audioUrl) {
      toast({
        title: "No audio available",
        description: "Please select a verse to play audio.",
        variant: "destructive",
      });
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          toast({
            title: "Error",
            description: "Failed to play audio. Please try again.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevVerse = () => {
    if (currentVerse > 1) {
      const newVerse = currentVerse - 1;
      onVerseChange?.(newVerse);
    }
  };

  const handleNextVerse = () => {
    if (currentVerse < totalVerses) {
      const newVerse = currentVerse + 1;
      onVerseChange?.(newVerse);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl || "";
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [audioUrl]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
      handleNextVerse();
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", handleEnded);
      return () => audio.removeEventListener("ended", handleEnded);
    }
  }, [currentVerse, totalVerses]);

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
              onVerseChange?.(value[0]);
            }}
          />
          <span className="text-sm">{totalVerses}</span>
        </div>
      </div>
    </div>
  );
};