import { getXpInCurrentLevel, XP_PER_LEVEL } from "@/data/mockData";

interface XPProgressProps {
  xp: number;
  level: number;
  animateBump?: boolean;
}

function getColors(pct: number): { arc: string; bar: string; glow: string } {
  if (pct < 34) return {
    arc: "#a855f7",
    bar: "linear-gradient(90deg, hsl(262 60% 55%) 0%, hsl(330 80% 62%) 100%)",
    glow: "0 0 10px hsl(262 60% 55% / 0.7), 0 0 20px hsl(330 80% 62% / 0.4)",
  };
  if (pct < 67) return {
    arc: "#f59e0b",
    bar: "linear-gradient(90deg, hsl(43 96% 56%) 0%, hsl(25 95% 55%) 100%)",
    glow: "0 0 10px hsl(43 96% 56% / 0.7), 0 0 20px hsl(25 95% 55% / 0.4)",
  };
  return {
    arc: "#22c55e",
    bar: "linear-gradient(90deg, hsl(142 71% 45%) 0%, hsl(186 80% 45%) 100%)",
    glow: "0 0 10px hsl(142 71% 45% / 0.8), 0 0 22px hsl(186 80% 45% / 0.5)",
  };
}

export default function XPProgress({ xp, level, animateBump }: XPProgressProps) {
  const xpInLevel = getXpInCurrentLevel(xp);
  const percent = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100);
  const { arc, bar, glow } = getColors(percent);

  const size = 40;
  const strokeW = 3;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div
      className="rounded-xl p-4 border border-border/60"
      style={{ background: "hsl(var(--card-elevated))" }}
    >
      {/* Level badge (SVG arc) + label */}
      <div className="flex items-center gap-3 mb-4">
        {/* SVG arc ring badge */}
        <div
          className={`relative shrink-0 flex items-center justify-center ${animateBump ? "animate-xp-bump" : ""}`}
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            className="absolute inset-0"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeW}
            />
            {/* Progress arc */}
            {percent > 0 && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={arc}
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                style={{ filter: `drop-shadow(0 0 4px ${arc})` }}
              />
            )}
          </svg>
          {/* Level number */}
          <span
            className="relative z-10 text-sm font-black"
            style={{ color: arc }}
          >
            {level}
          </span>
        </div>

        <div className="flex flex-col">
          <span
            className={`text-sm font-bold leading-none ${animateBump ? "animate-level-up-glow" : ""}`}
            style={{ color: "hsl(var(--foreground))" }}
          >
            Level {level}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">
            {xpInLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>

        <span className="ml-auto text-xs text-muted-foreground font-medium">
          Level {level + 1}
        </span>
      </div>

      {/* Progress bar with gradient + glow */}
      <div
        className="w-full h-2.5 rounded-full overflow-visible relative"
        style={{ background: "hsl(var(--xp-bar-bg))" }}
      >
        {percent > 0 && (
          <div
            className="xp-bar-fill"
            style={{
              width: `${percent}%`,
              background: bar,
              boxShadow: glow,
            }}
          />
        )}
      </div>
    </div>
  );
}
