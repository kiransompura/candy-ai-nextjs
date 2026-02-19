"use client";

import { UserRound } from "lucide-react";
import XPProgress from "./XPProgress";
import UnlockItemCard from "./UnlockItemCard";
import { VideoItem } from "@/data/mockData";
import { useCallback } from "react";

interface UnlockablePanelProps {
  videoList: VideoItem[];
  userLevel: number;
  xp: number;
  activeVideoId: string | null;
  justUnlockedId: string | null;
  xpBump: boolean;
  onSelectVideo: (id: string) => void;
}

export default function UnlockablePanel({
  videoList,
  userLevel,
  xp,
  activeVideoId,
  justUnlockedId,
  xpBump,
  onSelectVideo,
}: UnlockablePanelProps) {
  const handleSelectVideo = useCallback(
    (id: string) => {
      onSelectVideo(id);
    },
    [onSelectVideo],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <UserRound size={20} className="text-foreground" />
        <h2 className="text-base font-bold text-foreground">Live Action</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-border text-muted-foreground">
          Beta v2
        </span>
      </div>

      {/* XP Card */}
      <XPProgress xp={xp} level={userLevel} animateBump={xpBump} />

      {/* Video List */}
      <div className="mt-4 flex flex-col">
        {videoList.map((item) => (
          <UnlockItemCard
            key={item.id}
            item={item}
            userLevel={userLevel}
            isActive={item.id === activeVideoId}
            justUnlocked={item.id === justUnlockedId}
            onClick={handleSelectVideo}
          />
        ))}
      </div>
    </div>
  );
}
