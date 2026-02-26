"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PlusCircle,
  Pill,
  FileText,
  TestTube,
  LogOut,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

const navItems = [
  { href: "/", key: "nav.dashboard", icon: LayoutDashboard, iconBg: "nav-icon-bg-dashboard", route: "dashboard" },
  { href: "/add", key: "nav.addEntry", icon: PlusCircle, iconBg: "nav-icon-bg-add", route: "add" },
  { href: "/medications", key: "nav.medications", icon: Pill, iconBg: "nav-icon-bg-meds", route: "medications" },
  { href: "/lab", key: "nav.lab", icon: TestTube, iconBg: "nav-icon-bg-lab", route: "lab" },
  { href: "/report", key: "nav.report", icon: FileText, iconBg: "nav-icon-bg-report", route: "report" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full w-[var(--sidebar-width)] flex-col",
        "border-r border-border bg-card shadow-soft",
        "md:flex"
      )}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--nav-dash-from))] to-[hsl(var(--nav-dash-to))] text-white shadow-[var(--nav-icon-shadow)]">
            <Droplets className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            OpenSugar
          </span>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Language
          </p>
          <LanguageSwitcher />
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {navItems.map(({ href, key, icon: Icon, iconBg, route }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                data-active={isActive}
                data-route={route}
                className={cn(
                  "sidebar-nav-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[color,background] duration-200",
                  !isActive && "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "sidebar-icon-wrap flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] text-white",
                    iconBg
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                </span>
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "sidebar-nav-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
              "text-muted-foreground transition-[color,background] duration-200 hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="sidebar-icon-wrap nav-icon-bg-signout flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] text-white">
              <LogOut className="h-4 w-4" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
            </span>
            {t("nav.signOut")}
          </button>
        </div>
      </div>
    </aside>
  );
}
