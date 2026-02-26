"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

type Status = "low" | "normal" | "high";

function getStatus(value: number): Status {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  return "high";
}

const statusConfig: Record<
  Status,
  { label: string; className: string; badgeClass: string }
> = {
  low: {
    label: "Low",
    className: "text-primary",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  normal: {
    label: "Normal",
    className: "text-success",
    badgeClass: "bg-success/10 text-success border-success/20",
  },
  high: {
    label: "High",
    className: "text-destructive",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface LatestReadingData {
  value: number;
  type: string;
  created_at: Date;
}

interface AveragesData {
  dailyAverage: number | null;
  dailyCount: number;
  last7DayAverage: number | null;
  last7DayCount: number;
}

interface NextCheckData {
  nextCheckAt: Date | null;
  progressPercent: number;
}

export function LastReadingCard({ latest }: { latest: LatestReadingData | null }) {
  const { t } = useLanguage();
  if (!latest) {
    return (
      <Card className="overflow-hidden transition-smooth hover:shadow-soft">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-sm font-medium text-muted-foreground">Last Reading</p>
          <p className="mt-1 text-xs text-muted-foreground">No readings yet</p>
          <Link
            href="/add"
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Add your first reading
          </Link>
        </CardContent>
      </Card>
    );
  }

  const status = getStatus(latest.value);
  const config = statusConfig[status];
  const time = new Date(latest.created_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden transition-smooth hover:shadow-soft">
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Last Reading
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {latest.type} · {time}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={cn("text-4xl font-bold tabular-nums tracking-tight", config.className)}
          >
            {latest.value}
          </span>
          <span className="text-muted-foreground text-sm">mg/dL</span>
        </div>
        <span
          className={cn(
            "mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
            config.badgeClass
          )}
        >
          {config.label}
        </span>
      </CardContent>
    </Card>
  );
}

export function AveragesCard({
  dailyAverage,
  dailyCount,
  last7DayAverage,
  last7DayCount,
}: AveragesData) {
  return (
    <Card className="transition-smooth hover:shadow-soft">
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Averages
        </p>
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {dailyCount === 0 ? "—" : Math.round(dailyAverage ?? 0)}
              {dailyCount > 0 && (
                <span className="ml-1 text-sm font-normal text-muted-foreground">mg/dL</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {last7DayCount === 0 ? "—" : Math.round(last7DayAverage ?? 0)}
              {last7DayCount > 0 && (
                <span className="ml-1 text-sm font-normal text-muted-foreground">mg/dL</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">7-day average</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NextCheckCard({ nextCheckAt, progressPercent }: NextCheckData) {
  const { t } = useLanguage();
  return (
    <Card className="transition-smooth hover:shadow-soft">
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Next Check
        </p>
        <div className="mt-3">
          {nextCheckAt ? (
            <>
              <p className="text-xl font-semibold tabular-nums text-foreground">
                {nextCheckAt.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Suggested</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log a reading to get suggestions
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
