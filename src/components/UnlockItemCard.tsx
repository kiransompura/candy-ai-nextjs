"use client";

import { Lock, Play, Sparkles } from "lucide-react";
import { VideoItem } from "@/data/mockData";

interface UnlockItemCardProps {
  item: VideoItem;
  userLevel: number;
  isActive: boolean;
  justUnlocked: boolean;
  onClick: () => void;
  onLockedClick?: () => void;
}

/* Color theme per required level */
const LEVEL_THEME: Record<number, { gradient: string; glow: string; badge: string; badgeBg: string; label: string }> = {
  1: { gradient: "linear-gradient(135deg,hsl(330 80% 62%),hsl(262 60% 55%))", glow: "0 0 14px hsl(330 80% 62% / 0.5)", badge: "hsl(330 80% 62%)", badgeBg: "hsl(330 80% 62% / 0.2)", label: "text-pink-400" },
  2: { gradient: "linear-gradient(135deg,hsl(262 60% 65%),hsl(220 80% 60%))", glow: "0 0 14px hsl(262 60% 55% / 0.5)", badge: "hsl(262 60% 60%)", badgeBg: "hsl(262 60% 60% / 0.2)", label: "text-violet-400" },
  3: { gradient: "linear-gradient(135deg,hsl(43 96% 56%),hsl(25 95% 55%))",   glow: "0 0 14px hsl(43 96% 56% / 0.5)",  badge: "hsl(43 96% 56%)",  badgeBg: "hsl(43 96% 56% / 0.2)",  label: "text-amber-400" },
  4: { gradient: "linear-gradient(135deg,hsl(142 71% 45%),hsl(186 80% 45%))", glow: "0 0 14px hsl(142 71% 45% / 0.5)", badge: "hsl(142 71% 45%)", badgeBg: "hsl(142 71% 45% / 0.2)", label: "text-emerald-400" },
  5: { gradient: "linear-gradient(135deg,hsl(0 72% 60%),hsl(330 80% 62%))",   glow: "0 0 14px hsl(0 72% 60% / 0.5)",   badge: "hsl(0 72% 60%)",   badgeBg: "hsl(0 72% 60% / 0.2)",   label: "text-rose-400" },
};

function getTheme(level: number) {
  return LEVEL_THEME[level] ?? LEVEL_THEME[5];
}

export default function UnlockItemCard({ item, userLevel, isActive, justUnlocked, onClick, onLockedClick }: UnlockItemCardProps) {
  const unlocked = userLevel >= item.requiredLevel;
  const theme = getTheme(item.requiredLevel);

  return (
    <button
      type="button"
      onClick={unlocked ? onClick : onLockedClick}
      className={`
        w-full group relative flex items-center gap-3 px-3 py-3 rounded-xl
        border transition-all duration-300 text-left
        ${unlocked
          ? isActive
            ? "border-white/10 cursor-pointer"
            : "border-transparent hover:border-white/8 cursor-pointer"
          : onLockedClick
            ? "border-transparent hover:border-white/8 cursor-pointer"
            : "border-transparent cursor-not-allowed"
        }
        ${justUnlocked ? "animate-unlock-pulse" : ""}
      `}
      style={isActive ? { background: "rgba(255,255,255,0.06)" } : undefined}
    >
      {/* Active glow behind entire row */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: theme.gradient, opacity: 0.07 }}
        />
      )}

      {/* Left: level-colored icon circle */}
      <div
        className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{
          background: unlocked ? theme.gradient : theme.badgeBg,
          boxShadow: unlocked && isActive ? theme.glow : "none",
          border: unlocked ? "none" : `1px solid ${theme.badge}`,
        }}
      >
        {unlocked
          ? <Play size={15} fill="white" className="text-white ml-0.5" />
          : <Lock size={13} className="text-white" style={{ color: theme.badge }} />
        }
      </div>

      {/* Center: title + sub-label */}
      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm font-semibold leading-tight truncate transition-colors duration-200 ${
            unlocked
              ? isActive ? "text-white" : "text-foreground group-hover:text-white"
              : "text-foreground"
          }`}
        >
          {item.title}
        </span>
        {unlocked ? (
          isActive ? (
            <span className="text-xs font-medium mt-0.5 flex items-center gap-1" style={{ color: theme.badge }}>
              <Sparkles size={10} />
              Now Playing
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/60 mt-0.5 block">Tap to play</span>
          )
        ) : (
          <span className="text-xs mt-0.5 font-medium block" style={{ color: theme.badge }}>
            Unlocks at Level {item.requiredLevel}
          </span>
        )}
      </div>

      {/* Right: action badge */}
      {unlocked ? (
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{
            background: isActive ? theme.gradient : "rgba(255,255,255,0.08)",
            boxShadow: isActive ? theme.glow : "none",
          }}
        >
          <Play size={11} fill="white" className="text-white ml-0.5" />
        </div>
      ) : (
        <div
          className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: theme.badgeBg,
            border: `1px solid ${theme.badge}`,
            color: theme.badge,
          }}
        >
          Lv {item.requiredLevel}
        </div>
      )}
    </button>
  );
}
