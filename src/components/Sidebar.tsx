import {
  Home,
  Compass,
  MessageCircle,
  Waves,
  Settings2,
  Sparkles,
  Heart,
  Tag,
  Flag,
  MessageSquare,
} from "lucide-react";

const TOP_ICONS = [
  { icon: Home, label: "Home", active: false },
  { icon: Compass, label: "Explore", active: false },
  { icon: MessageCircle, label: "Chat", active: false },
  { icon: Waves, label: "Stories", active: false },
  { icon: Settings2, label: "Settings", active: false },
  { icon: Sparkles, label: "Magic", active: false },
  { icon: Heart, label: "Favorites", active: false },
  { icon: Tag, label: "Premium", active: true },
];

const BOTTOM_ICONS = [
  { icon: Flag, label: "Language" },
  { icon: MessageSquare, label: "Discord" },
];

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex fixed left-0 top-14 bottom-0 w-[88px] flex-col items-center pt-4 pb-4 border-r border-border z-40"
      style={{ background: "hsl(var(--sidebar-background))" }}
    >
      {/* Top icons */}
      <div className="flex flex-col items-center gap-3 flex-1">
        {TOP_ICONS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={`
              w-12 h-12 flex items-center justify-center rounded-xl border border-border/70 transition-all duration-200
              ${active
                ? "sidebar-icon-active"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }
            `}
          >
            <Icon size={24} />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-border my-2" />

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-3">
        {BOTTOM_ICONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
          >
            <Icon size={24} />
          </button>
        ))}
      </div>
    </aside>
  );
}
