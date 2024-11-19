import { toast } from "@/hooks/use-toast";

const API_BASE = "https://api.quran.com/api/v4";

export interface Surah {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  revelation_place: string;
}

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  audio: {
    url: string;
  };
  translations: Array<{
    text: string;
  }>;
}

export const fetchSurahs = async () => {
  try {
    const response = await fetch(`${API_BASE}/chapters`);
    if (!response.ok) throw new Error("Failed to fetch surahs");
    const data = await response.json();
    return data.chapters as Surah[];
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load Surahs. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchSurah = async (id: number) => {
  try {
    const [surahResponse, versesResponse] = await Promise.all([
      fetch(`${API_BASE}/chapters/${id}`),
      fetch(
        `${API_BASE}/verses/by_chapter/${id}?translations=131&fields=text_uthmani&word_fields=text_uthmani&word_translations=131&audio=1&per_page=300`
      ),
    ]);

    if (!surahResponse.ok || !versesResponse.ok) {
      throw new Error("Failed to fetch surah data");
    }

    const surahData = await surahResponse.json();
    const versesData = await versesResponse.json();

    // Transform the audio URL to ensure it's complete
    const verses = versesData.verses.map((verse: any) => ({
      ...verse,
      audio: {
        url: verse.audio?.url ? `https://verses.quran.com/${verse.audio.url}` : null,
      },
    }));

    return {
      surah: surahData.chapter,
      verses,
    };
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load Surah. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};