import { AppSidebar } from "./AppSidebar";
import { PotatoChatbot } from "@/components/chatbot/PotatoChatbot";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-8 max-w-7xl">
          {children}
        </div>
      </main>
      <PotatoChatbot />
    </div>
  );
}
