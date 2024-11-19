import { useQuery } from "@tanstack/react-query";
import { fetchSurahs } from "@/lib/api";
import { SurahCard } from "@/components/SurahCard";

const Index = () => {
  const { data: surahs, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading Surahs...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 min-h-screen geometric-pattern">
      <h1 className="text-4xl font-bold text-center mb-2">The Noble Quran</h1>
      <p className="text-center mb-8 text-gray-600">
        Select a Surah to begin reading
      </p>

      <div className="space-y-4">
        {surahs?.map((surah) => (
          <SurahCard key={surah.id} surah={surah} />
        ))}
      </div>
    </div>
  );
};

export default Index;