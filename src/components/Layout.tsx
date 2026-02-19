import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileBottomTabs from "./MobileBottomTabs";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <MobileBottomTabs />

      {/* Main content — offset for sidebar on desktop, bottom tabs on mobile */}
      <main className="pt-14 md:pl-[88px] pb-16 md:pb-0 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
