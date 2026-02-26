import { Suspense } from "react";
import {
  getGlucoseLogs,
  getGlucoseLogsInRange,
  getMedicationLogsInRange,
} from "@/app/actions";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Fab } from "@/components/fab";
import { DashboardChartsSection } from "@/components/dashboard/dashboard-charts-section";
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
          <DashboardChartsSection timeInRange={timeInRange} hourlyData={hourlyData} />
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
