import { Home, Compass, MessageCircle, Heart, Tag } from "lucide-react";

const TABS = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: MessageCircle, label: "Chat", active: true },
  { icon: Heart, label: "Favorites" },
  { icon: Tag, label: "Premium" },
];

export default function MobileBottomTabs() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border h-16"
      style={{ background: "hsl(var(--sidebar-background))" }}
    >
      {TABS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          className={`flex flex-col items-center gap-1 px-3 py-2 ${
            active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
