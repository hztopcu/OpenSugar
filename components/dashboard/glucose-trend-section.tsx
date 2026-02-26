"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendChart } from "@/components/trend-chart";
import { cn } from "@/lib/utils";
import { LineChart } from "lucide-react";

interface ChartViewProps {
  chartData7: { date: string; value: number; type: string }[];
  chartData30: { date: string; value: number; type: string }[];
  medicationEvents: { taken_at: string; name?: string }[];
}

const RANGES = [7, 14, 30] as const;

export function GlucoseTrendSection({
  chartData7,
  chartData30,
  medicationEvents,
}: ChartViewProps) {
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const cutoff14 = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const chartData14 = chartData30.filter(
    (d) => new Date(d.date).getTime() >= cutoff14
  );
  const data =
    days === 7 ? chartData7 : days === 14 ? chartData14 : chartData30;

  const empty = data.length === 0;

  return (
    <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-2 transition-smooth hover-lift">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-blue))]/20">
              <LineChart className="h-5 w-5 text-[hsl(var(--health-blue))]" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Glucose Trend</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Healthy zone 70–140 mg/dL
              </p>
            </div>
          </div>
          <div className="flex gap-1 rounded-2xl bg-muted/50 p-1">
            {RANGES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-smooth",
                  days === d
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <svg
                className="h-10 w-10 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 011.414-1.414l2.336-2.336a2.25 2.25 0 00.658-1.604l-1.5-7.5a2.25 2.25 0 00-.658-1.604L12 2.25z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              No data in the last {days} days
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a reading to see your trend
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <TrendChart
              data={data}
              medicationEvents={medicationEvents}
              days={days === 14 ? 30 : days}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
