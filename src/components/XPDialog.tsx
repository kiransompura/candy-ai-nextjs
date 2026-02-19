"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle } from "lucide-react";
import { getXpInCurrentLevel, XP_PER_LEVEL } from "@/data/mockData";

interface XPDialogProps {
  isOpen: boolean;
  xp: number;
  userLevel: number;
  onClose: () => void;
}

export default function XPDialog({ isOpen, xp, userLevel, onClose }: XPDialogProps) {
  const xpInLevel = getXpInCurrentLevel(xp);
  const percent = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl overflow-hidden animate-confirm-pop"
        style={{
          background: "rgba(16,16,16,0.96)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            {/* Gem-like XP icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{
                background: "linear-gradient(135deg, hsl(var(--xp-green)) 0%, hsl(142 71% 30%) 100%)",
                boxShadow: "0 4px 14px hsl(var(--xp-green) / 0.4)",
              }}
            >
              ⚡
            </div>
            <h2 className="text-base font-bold text-foreground tracking-tight">XP Rewards</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-5 h-px mb-4" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* ── XP Progress Card ── */}
        <div
          className="mx-5 mb-4 rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Level badge + label */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0"
              style={{
                borderColor: "hsl(var(--xp-green))",
                color: "hsl(var(--xp-green))",
                background: "hsl(var(--xp-green) / 0.1)",
                boxShadow: "0 0 12px hsl(var(--xp-green) / 0.25)",
              }}
            >
              {userLevel}
            </div>
            <span className="font-semibold text-foreground text-sm">Level {userLevel}</span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2.5 rounded-full overflow-hidden mb-2.5"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percent}%`,
                background: "linear-gradient(90deg, hsl(var(--xp-green)) 0%, hsl(142 71% 60%) 100%)",
                boxShadow: "0 0 8px hsl(var(--xp-green) / 0.6)",
              }}
            />
          </div>

          {/* XP numbers */}
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: "hsl(var(--xp-green))" }} className="font-semibold">
              {xpInLevel} / {XP_PER_LEVEL} XP
            </span>
            <span className="text-muted-foreground">Level {userLevel + 1}</span>
          </div>
        </div>

        {/* ── How to earn XP ── */}
        <div className="mx-5 mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <MessageCircle size={15} className="shrink-0" style={{ color: "hsl(var(--primary))" }} />
            <h3 className="text-sm font-semibold text-foreground">How to earn XP</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            Earn XP by chatting with your AI to level up and unlock more Live Actions.{" "}
            <span className="text-foreground/70 font-medium">Spam messages won&apos;t earn XP.</span>
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--pink)) 100%)",
              boxShadow: "0 4px 20px hsl(var(--primary) / 0.4)",
            }}
          >
            Start Chatting →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
