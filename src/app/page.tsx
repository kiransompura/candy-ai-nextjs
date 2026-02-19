"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import VideoPlayer from "@/components/VideoPlayer";
import UnlockablePanel from "@/components/UnlockablePanel";
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

const XPDialog = dynamic(() => import("@/components/XPDialog"), { ssr: false });
const LoadingOverlay = dynamic(() => import("@/components/LoadingOverlay"), { ssr: false });

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
  const activeVideo = useMemo<VideoItem | null>(
    () =>
      activeVideoId != null
        ? VIDEO_LIST.find((v: VideoItem) => v.id === activeVideoId) ?? null
        : null,
    [activeVideoId],
  );
  const activeVideoUrl = activeVideo?.videoUrl ?? null;
  const activeVideoTitle = activeVideo?.title ?? "";

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

  const handleSendMessage = useCallback((text: string) => {
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
  }, [xp]);

  const handleResetChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSwitchToDefault = useCallback(() => {
    setActiveVideoId(null);
  }, []);

  const handleOpenXPDialog = useCallback(() => {
    setShowXPDialog(true);
  }, []);

  const handleCloseXPDialog = useCallback(() => {
    setShowXPDialog(false);
  }, []);

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
          activeVideoTitle={activeVideoTitle}
          activeVideoUrl={activeVideoUrl}
          userLevel={userLevel}
          xp={xp}
          xpToast={xpToast}
          onResetChat={handleResetChat}
          onSwitchToDefault={handleSwitchToDefault}
          onLevelBadgeClick={handleOpenXPDialog}
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
          activeVideoTitle={activeVideoTitle}
          activeVideoUrl={activeVideoUrl}
          userLevel={userLevel}
          xp={xp}
          xpToast={xpToast}
          onResetChat={handleResetChat}
          onSwitchToDefault={handleSwitchToDefault}
          onLevelBadgeClick={handleOpenXPDialog}
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
        onClose={handleCloseXPDialog}
      />
    </Layout>
    </>
  );
}
