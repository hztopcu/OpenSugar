"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

interface TiRData {
  hypo: number;
  inRange: number;
  slightlyHigh: number;
  high: number;
}

export function ReportTimeInRange({ data }: { data: TiRData }) {
  const { t } = useLanguage();
  const total = data.hypo + data.inRange + data.slightlyHigh + data.high;

  if (total === 0) {
    return (
      <Card className="rounded-[22px] shadow-card border-border/60">
        <CardHeader>
          <span className="font-semibold">{t("report.timeInRange")}</span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("report.noTirData")}</p>
        </CardContent>
      </Card>
    );
  }

  const segments = [
    { value: data.hypo, labelKey: "report.hypo", color: "text-[hsl(var(--health-blue))]" },
    { value: data.inRange, labelKey: "report.inRange", color: "text-[hsl(var(--health-green))]" },
    { value: data.slightlyHigh, labelKey: "report.slightlyHigh", color: "text-[hsl(var(--health-orange))]" },
    { value: data.high, labelKey: "report.high", color: "text-[hsl(var(--health-pink-red))]" },
  ];

  return (
    <Card className="rounded-[22px] shadow-card border-border/60">
      <CardHeader>
        <span className="font-semibold">{t("report.timeInRange")}</span>
        <p className="text-muted-foreground font-normal text-sm">{t("report.tirHint")}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {segments.map((seg) => (
            <div key={seg.labelKey}>
              <p className={cn("text-2xl font-bold", seg.color)}>{seg.value}%</p>
              <p className="text-muted-foreground text-xs">{t(seg.labelKey)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
