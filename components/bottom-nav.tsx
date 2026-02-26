"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Pill,
  TestTube,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { useProfileDrawer } from "@/components/profile-drawer";

const navItems = [
  { href: "/", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/add", key: "nav.addEntry", icon: PlusCircle },
  { href: "/medications", key: "nav.medications", icon: Pill },
  { href: "/lab", key: "nav.lab", icon: TestTube },
  { href: "/report", key: "nav.report", icon: FileText },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { open } = useProfileDrawer();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around",
        "border-t border-border bg-card shadow-soft",
        "h-[var(--bottom-nav-height)] px-2 safe-area-pb",
        "md:hidden"
      )}
    >
      {navItems.map(({ href, key, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 min-w-[56px] transition-smooth",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6 shrink-0" />
            <span className="text-[10px] font-medium">
              {t(key)}
            </span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={open}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 min-w-[56px] transition-smooth",
          "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Profile and settings"
      >
        <User className="h-6 w-6 shrink-0" />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  );
}
