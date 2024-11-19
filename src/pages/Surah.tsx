import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSurah } from "@/lib/api";
import { VerseRow } from "@/components/VerseRow";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Surah = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentVerse, setCurrentVerse] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["surah", id],
    queryFn: () => fetchSurah(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading Surah...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container max-w-4xl py-8 pb-32 min-h-screen geometric-pattern">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Surahs
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{data.surah.name_simple}</h1>
        <p className="arabic-text text-3xl mb-2">{data.surah.name_arabic}</p>
        <p className="text-gray-600">
          {data.surah.verses_count} verses • {data.surah.revelation_place}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        {data.verses.map((verse) => (
          <VerseRow
            key={verse.id}
            verse={verse}
            isHighlighted={
              Number(verse.verse_key.split(":")[1]) === currentVerse
            }
          />
        ))}
      </div>

      <AudioPlayer
        totalVerses={data.surah.verses_count}
        onVerseChange={setCurrentVerse}
      />
    </div>
  );
};

export default Surah;