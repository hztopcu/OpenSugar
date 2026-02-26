import { Suspense } from "react";
import {
  getGlucoseLogs,
  getGlucoseLogsInRange,
  getMedicationLogsInRange,
} from "@/app/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Fab } from "@/components/fab";
import { TimeInRangeChart } from "@/components/time-in-range-chart";
import { HourlyDistributionChart } from "@/components/hourly-distribution-chart";
import { SmartGlucoseAlerts } from "@/components/smart-glucose-alerts";
import { AppleHealthHeader } from "@/components/dashboard/apple-health-header";
import { TodaysGlucoseCard } from "@/components/dashboard/todays-glucose-card";
import { GlucoseTrendSection } from "@/components/dashboard/glucose-trend-section";
import { QuickAddCard } from "@/components/dashboard/quick-add-card";
import { HistorySection } from "@/components/dashboard/history-section";

function getTodayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function getMorningEvening(
  todayLogs: { value: number; type: string; created_at: Date }[]
): {
  morning: { value: number; type: string; created_at: Date } | null;
  evening: { value: number; type: string; created_at: Date } | null;
} {
  const morningLogs = todayLogs.filter(
    (l) => new Date(l.created_at).getHours() < 12
  );
  const eveningLogs = todayLogs.filter(
    (l) => new Date(l.created_at).getHours() >= 12
  );
  const morning =
    morningLogs.length > 0
      ? morningLogs.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
      : null;
  const evening =
    eveningLogs.length > 0
      ? eveningLogs.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]
      : null;
  return { morning, evening };
}

async function DashboardContent() {
  const [logs, last7, last30, medLogs7] = await Promise.all([
    getGlucoseLogs(),
    getGlucoseLogsInRange(7),
    getGlucoseLogsInRange(30),
    getMedicationLogsInRange(7),
  ]);

  const latest = logs[0] ?? null;
  const todayStart = getTodayStart();
  const todayLogs = logs.filter(
    (l) => new Date(l.created_at).getTime() >= todayStart
  );
  const { morning, evening } = getMorningEvening(todayLogs);

  const chartData7 = last7.map((r) => ({
    date: new Date(r.created_at).toISOString(),
    value: r.value,
    type: r.type,
  }));
  const chartData30 = last30.map((r) => ({
    date: new Date(r.created_at).toISOString(),
    value: r.value,
    type: r.type,
  }));
  const medicationEvents = medLogs7.map((m) => ({
    taken_at: new Date(m.taken_at).toISOString(),
    name: m.medication_name,
  }));

  let hypo = 0,
    inRange = 0,
    slightlyHigh = 0,
    high = 0;
  for (const l of logs) {
    if (l.value < 70) hypo++;
    else if (l.value <= 140) inRange++;
    else if (l.value <= 180) slightlyHigh++;
    else high++;
  }
  const totalTir = logs.length;
  const timeInRange =
    totalTir > 0
      ? {
          hypo: Math.round((hypo / totalTir) * 100),
          inRange: Math.round((inRange / totalTir) * 100),
          slightlyHigh: Math.round((slightlyHigh / totalTir) * 100),
          high: Math.round((high / totalTir) * 100),
        }
      : { hypo: 0, inRange: 0, slightlyHigh: 0, high: 0 };
  const hourlyData = last30.map((r) => ({
    created_at: r.created_at,
    value: r.value,
  }));

  return (
    <div className="space-y-6">
      <AppleHealthHeader lastUpdated={latest?.created_at ?? null} />

      <div className="px-4 md:px-6 -mt-2">
        <section className="space-y-4">
          <QuickAddCard />
        </section>

        <section className="mt-6">
          <TodaysGlucoseCard morning={morning} evening={evening} />
        </section>

        <section className="mt-6">
          <GlucoseTrendSection
            chartData7={chartData7}
            chartData30={chartData30}
            medicationEvents={medicationEvents}
          />
        </section>

        <section className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-3 transition-smooth hover-lift">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-green))]/20">
                    <svg className="h-5 w-5 text-[hsl(var(--health-green))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      Time in Range
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      % of readings in each zone
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
                      Hourly distribution
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Average glucose by hour
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <HourlyDistributionChart data={hourlyData} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-6 pb-24 md:pb-8">
          <HistorySection logs={logs} />
        </section>
      </div>

      {latest != null && <SmartGlucoseAlerts value={latest.value} />}
      <Fab />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
