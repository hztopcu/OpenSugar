"use client";

import { useState } from "react";
import { TrendChart } from "@/components/trend-chart";
import { Button } from "@/components/ui/button";

interface ChartViewProps {
  chartData7: { date: string; value: number; type: string }[];
  chartData30: { date: string; value: number; type: string }[];
  medicationEvents: { taken_at: string }[];
}

export function ChartView({
  chartData7,
  chartData30,
  medicationEvents,
}: ChartViewProps) {
  const [days, setDays] = useState<7 | 30>(7);
  const data = days === 7 ? chartData7 : chartData30;

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
        No data in the last {days} days
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button
          variant={days === 7 ? "default" : "outline"}
          size="sm"
          onClick={() => setDays(7)}
        >
          7 days
        </Button>
        <Button
          variant={days === 30 ? "default" : "outline"}
          size="sm"
          onClick={() => setDays(30)}
        >
          30 days
        </Button>
      </div>
      <TrendChart
        data={data}
        medicationEvents={medicationEvents}
        days={days}
      />
    </div>
  );
}
