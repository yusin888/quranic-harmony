import { toast } from "@/components/ui/use-toast";

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
        `${API_BASE}/verses/by_chapter/${id}?translations=131&fields=text_uthmani&per_page=300`
      ),
    ]);

    if (!surahResponse.ok || !versesResponse.ok) {
      throw new Error("Failed to fetch surah data");
    }

    const surahData = await surahResponse.json();
    const versesData = await versesResponse.json();

    return {
      surah: surahData.chapter,
      verses: versesData.verses,
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