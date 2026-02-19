import { Message } from "@/data/mockData";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-slide-in-up">
        <span
          className="px-3 py-1.5 rounded-2xl text-sm font-medium max-w-[75%] text-foreground"
          style={{ background: "hsl(var(--user-bubble))" }}
        >
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-in-up">
      <span
        className="px-3 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed"
        style={{
          background: "rgba(30,30,30,0.85)",
          color: "hsl(var(--foreground))",
          backdropFilter: "blur(8px)",
        }}
      >
        {message.text}
      </span>
    </div>
  );
}
