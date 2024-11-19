import { Verse } from "@/lib/api";

interface VerseRowProps {
  verse: Verse;
  isHighlighted?: boolean;
}

export const VerseRow = ({ verse, isHighlighted }: VerseRowProps) => {
  return (
    <div
      className={`p-4 border-b ${
        isHighlighted ? "verse-highlight" : ""
      } hover:bg-secondary/10`}
    >
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
          {verse.verse_key.split(":")[1]}
        </div>
        <div className="space-y-4 flex-1">
          <p className="arabic-text">{verse.text_uthmani}</p>
          <p className="text-gray-700 leading-relaxed">
            {verse.translations[0]?.text}
          </p>
        </div>
      </div>
    </div>
  );
};