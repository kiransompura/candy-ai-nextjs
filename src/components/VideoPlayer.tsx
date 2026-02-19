"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX, MoreVertical, X, Repeat, RefreshCw, EyeOff, Eye, Send } from "lucide-react";
import Image from "next/image";
import MessageBubble from "./MessageBubble";
import SuggestedMessages from "./SuggestedMessages";
import ConfirmDialog from "./ConfirmDialog";
import { Message, SUGGESTED_MESSAGES, BOT_NAME, DEFAULT_VIDEOS, XP_PER_LEVEL, getXpInCurrentLevel } from "@/data/mockData";

interface VideoPlayerProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  activeVideoTitle: string;
  activeVideoUrl: string | null;
  userLevel: number;
  xp: number;
  xpToast?: { id: number; amount: number } | null;
  onResetChat: () => void;
  onSwitchToDefault: () => void;
  onLevelBadgeClick?: () => void;
}

// Shared glassmorphism style for all control buttons
const glassBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const glassBtnActive: React.CSSProperties = {
  background: "rgba(139,92,246,0.5)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(139,92,246,0.45)",
};

export default function VideoPlayer({
  messages,
  isTyping,
  onSendMessage,
  activeVideoTitle,
  activeVideoUrl,
  userLevel,
  onResetChat,
  onSwitchToDefault,
  onLevelBadgeClick,
  xpToast,
  xp,
}: VideoPlayerProps) {
  const [inputValue, setInputValue] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isChatHidden, setIsChatHidden] = useState(false);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [defaultVideoIndex, setDefaultVideoIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isLevelMode = activeVideoUrl != null;
  const currentVideoSrc = isLevelMode ? activeVideoUrl : DEFAULT_VIDEOS[defaultVideoIndex];

  // Scroll chat container (not the page) to bottom on new messages / typing
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);


  // Close more-menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  // Auto-hide chat when entering level mode; auto-show + reset loop when leaving
  useEffect(() => {
    if (isLevelMode) {
      setIsChatHidden(true);
      setIsLoopEnabled(false);
    } else {
      setIsChatHidden(false);
    }
  }, [isLevelMode]);

  // When video src changes: reload and play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.src = currentVideoSrc;
    video.load();
    video.play().catch(() => {});
  }, [currentVideoSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync muted state without reloading
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);


  const handleVideoEnded = useCallback(() => {
    if (isLevelMode) {
      if (!isLoopEnabled) onSwitchToDefault();
    } else {
      setDefaultVideoIndex((prev) => (prev + 1) % DEFAULT_VIDEOS.length);
    }
  }, [isLevelMode, isLoopEnabled, onSwitchToDefault]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    onSendMessage(text);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleSuggestion = (text: string) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter falls through naturally — textarea inserts newline
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-grow
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden select-none"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          loop={!isLevelMode || isLoopEnabled}
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Fallback image behind video while it loads */}
        <Image
          src="/mila-bg.jpg"
          alt={BOT_NAME}
          fill
          className="object-cover object-top -z-10"
          draggable={false}
          priority
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 video-overlay-gradient" />

        {/* ── Top-left: avatar + name + level badge ── */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-foreground/20 relative">
            <Image src="/mila-bg.jpg" alt={BOT_NAME} fill className="object-cover object-top" />
          </div>
          <span className="text-sm font-semibold text-foreground drop-shadow">{BOT_NAME}</span>

          {/* Level badge with SVG arc progress ring */}
          {(() => {
            const pct = Math.min((getXpInCurrentLevel(xp) / XP_PER_LEVEL) * 100, 100);
            const size = 32;
            const strokeW = 2.5;
            const r = (size - strokeW) / 2;
            const circ = 2 * Math.PI * r;
            const dash = (pct / 100) * circ;
            // Rotate so arc starts from top (-90°)
            const arcColor =
              pct < 34 ? "#a855f7"   // purple
              : pct < 67 ? "#f59e0b"  // amber
              : "#22c55e";            // green
            return (
              <button
                type="button"
                onClick={onLevelBadgeClick}
                title={onLevelBadgeClick ? "View XP & rewards" : undefined}
                className={`relative flex items-center justify-center transition-all overflow-visible ${onLevelBadgeClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""}`}
                style={{ width: size, height: size }}
              >
                {/* Track + arc */}
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
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={strokeW}
                  />
                  {/* Progress arc */}
                  {pct > 0 && (
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      fill="none"
                      stroke={arcColor}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                      strokeDasharray={`${dash} ${circ}`}
                      style={{ filter: `drop-shadow(0 0 3px ${arcColor})` }}
                    />
                  )}
                </svg>
                {/* Level number */}
                <span
                  className="relative z-10 text-[11px] font-black text-white leading-none"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                >
                  {userLevel}
                </span>

                {/* XP Toast — floats to the right of the badge */}
                {xpToast && (
                  <div key={xpToast.id} className="xp-toast">
                    +{xpToast.amount} XP
                  </div>
                )}
              </button>
            );
          })()}
        </div>

        {/* ── Top-right: all controls stacked vertically ── */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">

          {/* Close (does nothing for now) */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:brightness-125 transition-all active:scale-90"
            style={glassBtn}
          >
            <X size={16} />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setIsMuted((m) => !m)}
            title={isMuted ? "Unmute" : "Mute"}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:brightness-125 transition-all active:scale-90"
            style={isMuted ? glassBtn : glassBtnActive}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Loop / autoplay — only in level mode, exactly below sound */}
          {isLevelMode && (
            <button
              onClick={() => setIsLoopEnabled((l) => !l)}
              title={isLoopEnabled ? "Loop on — click to disable" : "Loop off — click to enable"}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:brightness-125 transition-all active:scale-90"
              style={isLoopEnabled ? glassBtnActive : glassBtn}
            >
              <Repeat size={16} />
            </button>
          )}

          {/* Eye toggle + three-dot menu — fade out slowly in level mode */}
          <div
            className="flex flex-col gap-2 transition-opacity duration-700"
            style={{ opacity: isLevelMode ? 0 : 1, pointerEvents: isLevelMode ? "none" : "auto" }}
          >
            {/* Hide / Show chat — now a standalone button */}
            <button
              onClick={() => setIsChatHidden((prev) => !prev)}
              title={isChatHidden ? "Show chat" : "Hide chat"}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:brightness-125 transition-all active:scale-90"
              style={isChatHidden && !isLevelMode ? glassBtnActive : glassBtn}
            >
              {isChatHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* More options — only Reset Chat remains */}
            <div ref={moreMenuRef} className="relative">
              <button
                onClick={() => setShowMoreMenu((s) => !s)}
                title="More options"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:brightness-125 transition-all active:scale-90"
                style={showMoreMenu ? glassBtnActive : glassBtn}
              >
                <MoreVertical size={16} />
              </button>

              {showMoreMenu && (
                <div
                  className="absolute top-full right-0 mt-2 z-30"
                  style={{ minWidth: "140px" }}
                >
                  <button
                    onClick={() => { setShowMoreMenu(false); setShowResetConfirm(true); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-left transition-all active:scale-95"
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  >
                    <RefreshCw size={14} className="shrink-0 opacity-80" />
                    Reset Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Chat section — slides down when hidden ── */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 transition-transform duration-500 ease-in-out ${
            isChatHidden ? "translate-y-full" : "translate-y-0"
          }`}
        >
          {/* Messages */}
          <div className="left-0 right-0 max-h-52 overflow-hidden relative">
            <div
              ref={chatScrollRef}
              className="overflow-y-auto flex flex-col gap-2 px-3 pt-8 max-h-52 scrollbar-thin chat-fade-mask"
              style={{ minHeight: "100%" }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-slide-in-up">
                  <div
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
                    style={{
                      background: "rgba(30,30,30,0.85)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            <div
              className="absolute top-0 left-0 right-0 h-20 pointer-events-none chat-top-blur"
              aria-hidden
            />
          </div>

          {/* Suggestions + input */}
          <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
            <SuggestedMessages suggestions={SUGGESTED_MESSAGES} onSelect={handleSuggestion} />

            <div
              className="flex items-center gap-2 px-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Anything"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-white/40 outline-none resize-none leading-5 overflow-hidden"
                style={{ maxHeight: "96px", padding: "12px 0" }}
              />
              {/* Always rendered — opacity toggle prevents height flicker */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shrink-0"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--pink)))",
                  boxShadow: inputValue.trim() ? "0 2px 8px hsl(var(--primary) / 0.45)" : "none",
                  opacity: inputValue.trim() ? 1 : 0.25,
                  cursor: inputValue.trim() ? "pointer" : "default",
                }}
                title="Send"
              >
                <Send size={14} strokeWidth={2.5} className="shrink-0 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog rendered via portal — outside overflow:hidden container */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Chat?"
        description="This will clear all your messages. This can't be undone."
        confirmLabel="Yes, Reset"
        cancelLabel="Cancel"
        onConfirm={() => { setShowResetConfirm(false); onResetChat(); }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
