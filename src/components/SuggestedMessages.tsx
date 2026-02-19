"use client";

interface SuggestedMessagesProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestedMessages({ suggestions, onSelect }: SuggestedMessagesProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold text-white/90 shrink-0">Suggestion:</span>
      {suggestions.slice(0, 2).map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "hsl(var(--user-bubble))" }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
