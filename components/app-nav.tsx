"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, Pill, FileText, TestTube, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

const navKeys = [
  { href: "/", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/add", key: "nav.addEntry", icon: PlusCircle },
  { href: "/medications", key: "nav.medications", icon: Pill },
  { href: "/lab", key: "nav.lab", icon: TestTube },
  { href: "/report", key: "nav.report", icon: FileText },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <LanguageSwitcher />
      <nav className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
        {navKeys.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t(key)}</span>
          </Link>
        ))}
      </nav>
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">{t("nav.signOut")}</span>
      </Button>
    </div>
  );
}
