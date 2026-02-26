"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppleHealthHeaderProps {
  lastUpdated: Date | null;
}

export function AppleHealthHeader({ lastUpdated }: AppleHealthHeaderProps) {
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
            Glucose
          </h1>
          <p className="text-sm text-foreground/80 mt-0.5">
            {lastUpdated
              ? `Last updated ${formatLastUpdated(lastUpdated)}`
              : "No readings yet"}
          </p>
        </div>
      </div>
    </header>
  );
}

function formatLastUpdated(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
