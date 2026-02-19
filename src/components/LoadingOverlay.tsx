"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingOverlayProps {
  botName: string;
  onDone: () => void;
}

type Phase = "tap" | "loading" | "fadeout";

export default function LoadingOverlay({ botName, onDone }: LoadingOverlayProps) {
  const [phase, setPhase] = useState<Phase>("tap");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTap = () => {
    if (phase !== "tap") return;
    setPhase("loading");

    // Auto-advance to fadeout after 2s
    setTimeout(() => {
      setPhase("fadeout");
      // Remove overlay after fade completes (600ms)
      setTimeout(onDone, 650);
    }, 2000);
  };

  // Start loader video when loading phase begins
  useEffect(() => {
    if (phase === "loading" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  return (
    <div
      className="fixed top-14 left-0 right-0 bottom-0 z-[45] flex items-center justify-center"
      style={{
        background: "hsl(var(--background))",
        transition: "opacity 0.6s ease",
        opacity: phase === "fadeout" ? 0 : 1,
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      {/* ── Phase 1: Tap to start ── */}
      {phase === "tap" && (
        <button
          type="button"
          onClick={handleTap}
          className="flex flex-col items-center gap-6 group outline-none"
        >
          {/* Outer pulse rings */}
          <div className="relative flex items-center justify-center">
            {/* Ring 1 */}
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 90,
                height: 90,
                background: "radial-gradient(circle, hsl(262 60% 55% / 0.15) 0%, transparent 70%)",
                animationDuration: "1.8s",
              }}
            />
            {/* Ring 2 */}
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: 70,
                height: 70,
                background: "radial-gradient(circle, hsl(330 80% 62% / 0.2) 0%, transparent 70%)",
                animationDuration: "1.8s",
                animationDelay: "0.4s",
              }}
            />
            {/* Center dot */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(262 60% 55%), hsl(330 80% 62%))",
                boxShadow: "0 0 30px hsl(262 60% 55% / 0.5), 0 0 60px hsl(330 80% 62% / 0.25)",
              }}
            >
              {/* Play triangle */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>

          {/* Tap to start text */}
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="text-xl font-black tracking-widest uppercase"
              style={{
                background: "linear-gradient(135deg, #fff 30%, hsl(262 60% 75%) 70%, hsl(330 80% 72%) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "tapPulse 2s ease-in-out infinite",
              }}
            >
              Tap to Start
            </span>
            <span className="text-xs text-muted-foreground tracking-wider">
              {botName} is waiting for you
            </span>
          </div>
        </button>
      )}

      {/* ── Phase 2: Loading ── */}
      {phase === "loading" && (
        <div className="flex flex-col items-center gap-5">
          {/* Loader video */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: 72,
              height: 72,
              boxShadow: "0 0 0 1.5px rgba(255,255,255,0.1), 0 0 24px hsl(262 60% 55% / 0.3)",
            }}
          >
            <video
              ref={videoRef}
              src="/videos/loader/loader.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-foreground/90 tracking-wide">
              Please wait...
            </span>
            <span className="text-sm text-muted-foreground">
              {botName} is getting ready.
            </span>
          </div>

          {/* Beta badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "hsl(var(--muted-foreground))",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            Beta v2
          </span>
        </div>
      )}
    </div>
  );
}
