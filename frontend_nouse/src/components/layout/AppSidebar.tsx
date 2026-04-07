import { Home, Leaf, BarChart3, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Diseases", url: "/diseases", icon: Leaf },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden transition-opacity",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-64",
          "md:relative md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-sidebar-foreground">PotatoDie</h1>
              <p className="text-xs text-sidebar-foreground/60">Disease Classifier</p>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-sm hover:bg-muted"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-3 w-3 text-foreground" />
        </Button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/50 text-center">
              AI-Powered Detection
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
