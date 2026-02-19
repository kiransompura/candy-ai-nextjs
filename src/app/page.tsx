"use client";

import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import VideoPlayer from "@/components/VideoPlayer";
import UnlockablePanel from "@/components/UnlockablePanel";
import XPDialog from "@/components/XPDialog";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  Message,
  VideoItem,
  VIDEO_LIST,
  XP_PER_MESSAGE,
  BOT_NAME,
  getLevel,
  getRandomBotReply,
  generateId,
} from "@/data/mockData";

export default function Home() {
  const [overlayDone, setOverlayDone] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [xp, setXp] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);
  const [xpBump, setXpBump] = useState(false);
  const [xpToast, setXpToast] = useState<{ id: number; amount: number } | null>(null);
  const [showXPDialog, setShowXPDialog] = useState(false);
  const prevLevelRef = useRef(1);

  const userLevel = getLevel(xp);
  const activeVideoUrl =
    activeVideoId != null
      ? (VIDEO_LIST.find((v: VideoItem) => v.id === activeVideoId)?.videoUrl ?? null)
      : null;

  useEffect(() => {
    const prev = prevLevelRef.current;
    if (userLevel > prev) {
      prevLevelRef.current = userLevel;
      const newlyUnlocked = VIDEO_LIST.find((v: VideoItem) => v.requiredLevel === userLevel);
      if (newlyUnlocked) {
        setJustUnlockedId(newlyUnlocked.id);
        setTimeout(() => setJustUnlockedId(null), 2000);
      }
    }
  }, [userLevel]);

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const newXp = xp + XP_PER_MESSAGE;
    setXp(newXp);
    setXpBump(true);
    setTimeout(() => setXpBump(false), 400);
    const toastId = Date.now();
    setXpToast({ id: toastId, amount: XP_PER_MESSAGE });
    setTimeout(() => setXpToast((t) => (t?.id === toastId ? null : t)), 1400);

    const delay = 900 + Math.random() * 700;
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: generateId(),
        role: "bot",
        text: getRandomBotReply(),
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, delay);
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleSwitchToDefault = () => {
    setActiveVideoId(null);
  };

  return (
    <>
    {!overlayDone && (
      <LoadingOverlay botName={BOT_NAME} onDone={() => setOverlayDone(true)} />
    )}
    <Layout>
      {/* ── Desktop: two equal columns, full viewport height ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4 px-5 py-6 h-[calc(100vh-3.5rem)] max-w-[1000px] mx-auto">
        <VideoPlayer
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          activeVideoTitle={activeVideoId != null ? (VIDEO_LIST.find((v: VideoItem) => v.id === activeVideoId)?.title ?? "") : ""}
          activeVideoUrl={activeVideoUrl}
          userLevel={userLevel}
          xp={xp}
          xpToast={xpToast}
          onResetChat={handleResetChat}
          onSwitchToDefault={handleSwitchToDefault}
          onLevelBadgeClick={() => setShowXPDialog(true)}
        />
        <div
          className="relative rounded-2xl p-4 border border-border overflow-y-auto"
          style={{ background: "hsl(var(--card))" }}
        >
          <UnlockablePanel
            videoList={VIDEO_LIST}
            userLevel={userLevel}
            xp={xp}
            activeVideoId={activeVideoId}
            justUnlockedId={justUnlockedId}
            xpBump={xpBump}
            onSelectVideo={setActiveVideoId}
          />
          {activeVideoId != null && (
            <div
              className="absolute inset-0 z-10 rounded-2xl"
              style={{ background: "rgba(0,0,0,0.45)" }}
              aria-hidden
            />
          )}
        </div>
      </div>

      {/* ── Mobile / tablet: stacked (unchanged) ── */}
      <div className="lg:hidden flex flex-col gap-3 p-3">
        <VideoPlayer
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          activeVideoTitle={activeVideoId != null ? (VIDEO_LIST.find((v: VideoItem) => v.id === activeVideoId)?.title ?? "") : ""}
          activeVideoUrl={activeVideoUrl}
          userLevel={userLevel}
          xp={xp}
          xpToast={xpToast}
          onResetChat={handleResetChat}
          onSwitchToDefault={handleSwitchToDefault}
          onLevelBadgeClick={() => setShowXPDialog(true)}
        />
        <div
          className="relative rounded-2xl p-4 border border-border"
          style={{ background: "hsl(var(--card))" }}
        >
          <UnlockablePanel
            videoList={VIDEO_LIST}
            userLevel={userLevel}
            xp={xp}
            activeVideoId={activeVideoId}
            justUnlockedId={justUnlockedId}
            xpBump={xpBump}
            onSelectVideo={setActiveVideoId}
          />
          {activeVideoId != null && (
            <div
              className="absolute inset-0 z-10 rounded-2xl"
              style={{ background: "rgba(0,0,0,0.45)" }}
              aria-hidden
            />
          )}
        </div>
      </div>

      <XPDialog
        isOpen={showXPDialog}
        xp={xp}
        userLevel={userLevel}
        onClose={() => setShowXPDialog(false)}
      />
    </Layout>
    </>
  );
}
