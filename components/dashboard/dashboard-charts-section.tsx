"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimeInRangeChart } from "@/components/time-in-range-chart";
import { HourlyDistributionChart } from "@/components/hourly-distribution-chart";
import { useLanguage } from "@/components/language-provider";

type TiRData = {
  hypo: number;
  inRange: number;
  slightlyHigh: number;
  high: number;
};

type HourlyPoint = { created_at: Date; value: number };

export function DashboardChartsSection({
  timeInRange,
  hourlyData,
}: {
  timeInRange: TiRData;
  hourlyData: HourlyPoint[];
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-3 transition-smooth hover-lift">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-green))]/20">
              <svg className="h-5 w-5 text-[hsl(var(--health-green))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t("dashboard.timeInRange")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.tirSubtitle")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TimeInRangeChart data={timeInRange} />
        </CardContent>
      </Card>
      <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-3 transition-smooth hover-lift">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-evening))]/20">
              <svg className="h-5 w-5 text-[hsl(var(--health-evening))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t("dashboard.hourlyDistribution")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.hourlyDistributionHint")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HourlyDistributionChart data={hourlyData} />
        </CardContent>
      </Card>
    </div>
  );
}
