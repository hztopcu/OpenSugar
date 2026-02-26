"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sun } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type Status = "low" | "normal" | "slightly_high" | "high";

function getStatus(value: number): Status {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  if (value <= 180) return "slightly_high";
  return "high";
}

function getStatusConfig(t: (key: string) => string): Record<Status, { label: string; dot: string; bg: string }> {
  return {
    low: { label: t("dashboard.low"), dot: "bg-[hsl(var(--health-blue))]", bg: "bg-[hsl(var(--health-blue))]/12" },
    normal: { label: t("dashboard.inRange"), dot: "bg-[hsl(var(--health-green))]", bg: "bg-[hsl(var(--health-green))]/12" },
    slightly_high: { label: t("dashboard.slightlyHigh"), dot: "bg-[hsl(var(--health-orange))]", bg: "bg-[hsl(var(--health-orange))]/12" },
    high: { label: t("dashboard.high"), dot: "bg-[hsl(var(--health-pink-red))]", bg: "bg-[hsl(var(--health-pink-red))]/12" },
  };
}

interface TodayReading {
  value: number;
  type: string;
  created_at: Date;
}

interface TodaysGlucoseCardProps {
  morning: TodayReading | null;
  evening: TodayReading | null;
}

function Block({
  label,
  reading,
  periodTint,
  statusConfig,
}: {
  label: string;
  reading: TodayReading | null;
  periodTint: "morning" | "evening";
  statusConfig: Record<Status, { label: string; dot: string; bg: string }>;
}) {
  if (!reading) {
    return (
      <div className="rounded-2xl bg-muted/40 px-5 py-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-muted-foreground">—</p>
        <p className="text-xs text-muted-foreground mt-0.5">mg/dL</p>
      </div>
    );
  }
  const status = getStatus(reading.value);
  const config = statusConfig[status];
  const time = new Date(reading.created_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const periodBg =
    periodTint === "morning"
      ? "bg-[hsl(var(--health-morning))]/15"
      : "bg-[hsl(var(--health-evening))]/15";
  return (
    <div
      className={cn(
        "rounded-2xl px-5 py-6 transition-smooth border border-transparent",
        periodBg,
        config.bg
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn("h-2.5 w-2.5 shrink-0 rounded-full", config.dot)}
          aria-hidden
        />
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">
        {reading.value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">mg/dL · {time}</p>
    </div>
  );
}

export function TodaysGlucoseCard({ morning, evening }: TodaysGlucoseCardProps) {
  const { t } = useLanguage();
  const statusConfig = getStatusConfig(t);
  const hasAny = morning || evening;
  return (
    <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-1 hover-lift transition-smooth">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-morning))]/20">
            <Sun className="h-5 w-5 text-[hsl(var(--health-orange))]" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{t("dashboard.today")}</h2>
            <p className="text-sm text-muted-foreground">{t("dashboard.todayHint")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAny ? (
          <div className="grid grid-cols-2 gap-4">
            <Block label={t("dashboard.morning")} reading={morning} periodTint="morning" statusConfig={statusConfig} />
            <Block label={t("dashboard.evening")} reading={evening} periodTint="evening" statusConfig={statusConfig} />
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/30 py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.noReadingsTodayYet")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("dashboard.addFirstReadingHint")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
