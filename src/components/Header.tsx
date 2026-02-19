import { Menu, Gem, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-border bg-background">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Menu size={20} />
        </button>
        <span className="text-lg font-bold tracking-tight">
          <span className="text-foreground">candy</span>
          <span className="text-pink">.ai</span>
        </span>
      </div>

      {/* Right: Premium + Profile */}
      <div className="flex items-center gap-3">
        {/* Premium button with gradient border */}
        <button className="gradient-premium-border flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-background text-sm font-semibold hover:bg-secondary transition-colors">
          <Gem size={14} className="text-primary" />
          <span className="text-foreground">Premium</span>
          <span className="text-pink font-bold">70% OFF</span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 hover:bg-secondary px-2 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-pink flex items-center justify-center text-sm font-bold overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-pink to-primary opacity-80 flex items-center justify-center text-foreground text-xs">
              M
            </div>
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground">My Profile</span>
          <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
