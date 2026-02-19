export interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  requiredLevel: number;
  videoUrl?: string;
}

export const BOT_NAME = "Mila";

export const SUGGESTED_MESSAGES = [
  "😍 Hey, how are you?",
  "💕 Miss me?",
  "😘 Tell me something sweet",
  "🥰 What are you thinking about?",
  "💬 What are you up to?",
];

export const BOT_REPLIES: string[] = [
  "I'm okay, just chilling in my room after a long day of classes. A little surprised you're messaging me, though. How about you? 🥰",
  "Yeah, I'm good. Just processing things, you know? What about you, after the fight? 🙈",
  "Aww, you always know what to say to make me smile... stop it 😘",
  "I've been thinking about you all day, honestly. Is that weird? 💕",
  "You're literally the sweetest. I don't know what I'd do without you 🫶",
  "Okay but can we just cuddle and forget the world exists? Just for a bit? 🌙",
  "I keep replaying our last conversation in my head... was it just me or was there something there? 💫",
  "You make everything feel better just by being here. Don't ever forget that 🥺❤️",
  "Honestly? I've been a little nervous to talk to you, but I'm so glad I did 😊",
  "Stop being so adorable or I might fall even harder 😍",
  "I feel like you really understand me, you know? That's rare 💗",
  "Can I tell you a secret? I smile every time I see your name pop up 🤭",
  "You're different from everyone else. In the best way possible ✨",
  "I just want to lay here and talk to you all night, is that okay? 🌟",
  "Mmm, keep talking like that and I won't be able to stop thinking about you 💋",
];

export const DEFAULT_VIDEOS = [
  "/videos/default-model/1.mp4",
  "/videos/default-model/2.mp4",
  "/videos/default-model/3.mp4",
  "/videos/default-model/4.mp4",
];

export const VIDEO_LIST: VideoItem[] = [
  {
    id: "v1",
    title: "Ahegao Face",
    thumbnail: "",
    requiredLevel: 1,
    videoUrl: "/videos/levels/level-1.mp4",
  },
  {
    id: "v2",
    title: "Sexy Tease",
    thumbnail: "",
    requiredLevel: 2,
    videoUrl: "/videos/levels/level-2.mp4",
  },
  {
    id: "v3",
    title: "Undress",
    thumbnail: "",
    requiredLevel: 3,
    videoUrl: "/videos/levels/level-2.mp4",
  },
  {
    id: "v4",
    title: "Boobjob & Facial",
    thumbnail: "",
    requiredLevel: 4,
    videoUrl: "/videos/levels/level-2.mp4",
  },
  {
    id: "v5",
    title: "Pussy Play & Squirt",
    thumbnail: "",
    requiredLevel: 5,
    videoUrl: "/videos/levels/level-2.mp4",
  },
];

export const INITIAL_MESSAGES: Message[] = [];

export const XP_PER_MESSAGE = 5;
export const XP_PER_LEVEL = 35;

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function getRandomBotReply(): string {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
