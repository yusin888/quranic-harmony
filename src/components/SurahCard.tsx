import { Surah } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SurahCardProps {
  surah: Surah;
}

export const SurahCard = ({ surah }: SurahCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={() => navigate(`/surah/${surah.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {surah.id}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{surah.name_simple}</h3>
          <p className="text-sm text-gray-600">
            {surah.verses_count} verses • {surah.revelation_place}
          </p>
        </div>
        <div className="arabic-text text-2xl">{surah.name_arabic}</div>
      </div>
    </Card>
  );
};