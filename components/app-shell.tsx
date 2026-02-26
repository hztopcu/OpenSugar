"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { ProfileDrawer } from "@/components/profile-drawer";

const APP_ROUTES = ["/", "/add", "/medications", "/lab", "/report"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = APP_ROUTES.includes(pathname ?? "");

  if (!isAppRoute) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen transition-smooth",
          "pb-[var(--bottom-nav-height)] md:pb-0 md:pl-[var(--sidebar-width)]"
        )}
      >
        {children}
      </main>
      <BottomNav />
      <ProfileDrawer />
    </div>
  );
}
