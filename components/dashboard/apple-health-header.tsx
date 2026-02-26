"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface AppleHealthHeaderProps {
  lastUpdated: Date | null;
}

export function AppleHealthHeader({ lastUpdated }: AppleHealthHeaderProps) {
  const { t } = useLanguage();
  return (
    <header
      className={cn(
        "header-gradient relative overflow-hidden rounded-b-[28px] px-5 pb-8 pt-6",
        "shadow-card"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            "bg-white/95 shadow-sm dark:bg-white/20"
          )}
          aria-hidden
        >
          <Heart
            className="h-7 w-7 text-[hsl(var(--health-pink))]"
            fill="hsl(var(--health-pink))"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("dashboard.bloodGlucose")}
          </h1>
          <p className="text-sm text-foreground/80 mt-0.5">
            {lastUpdated
              ? t("dashboard.lastUpdated").replace("{{text}}", formatLastUpdated(lastUpdated, t))
              : t("dashboard.noReadingsYet")}
          </p>
        </div>
      </div>
    </header>
  );
}

function formatLastUpdated(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return t("dashboard.justNow");
  if (diffMins < 60) return t("dashboard.minutesAgo").replace("{{n}}", String(diffMins));
  if (diffHours < 24) return t("dashboard.hoursAgo").replace("{{n}}", String(diffHours));
  if (diffDays === 1) return t("dashboard.yesterday");
  if (diffDays < 7) return t("dashboard.daysAgo").replace("{{n}}", String(diffDays));
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
