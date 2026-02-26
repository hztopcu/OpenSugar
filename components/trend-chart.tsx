"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
  Legend,
} from "recharts";
import { useLanguage } from "@/components/language-provider";

const MED_COLORS = ["#0c8ee6", "#e67e22", "#9b59b6", "#1abc9c", "#e74c3c"];

function colorForMed(name: string | undefined): string {
  if (!name) return MED_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return MED_COLORS[Math.abs(h) % MED_COLORS.length];
}

interface DataPoint {
  date: string;
  value: number;
  type: string;
  displayTime?: string;
  movingAvg?: number;
}

interface MedEvent {
  taken_at: string;
  displayTime?: string;
  name?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  medicationEvents?: MedEvent[];
  days?: 7 | 30;
}

/** 3-day moving average: daily averages then rolling 3-day window */
export function TrendChart({ data, medicationEvents = [], days = 7 }: TrendChartProps) {
  const { t } = useLanguage();
  const chartData = useMemo(() => {
    const withTime = data.map((d) => ({
      ...d,
      displayTime: new Date(d.date).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    const sorted = [...withTime].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by calendar day (YYYY-MM-DD), compute daily average
    const dayKey = (date: Date) => date.toISOString().slice(0, 10);
    const byDay = new Map<string, { sum: number; count: number }>();
    for (const d of sorted) {
      const k = dayKey(new Date(d.date));
      const cur = byDay.get(k) ?? { sum: 0, count: 0 };
      cur.sum += d.value;
      cur.count += 1;
      byDay.set(k, cur);
    }
    const dayOrder = Array.from(byDay.keys()).sort();
    const dailyAvg = new Map<string, number>();
    for (const k of dayOrder) {
      const cur = byDay.get(k)!;
      dailyAvg.set(k, Math.round(cur.sum / cur.count));
    }

    // 3-day moving average per day
    const threeDayMA = new Map<string, number>();
    for (let i = 0; i < dayOrder.length; i++) {
      let sum = 0, n = 0;
      for (let j = Math.max(0, i - 2); j <= i; j++) {
        sum += dailyAvg.get(dayOrder[j])!;
        n++;
      }
      threeDayMA.set(dayOrder[i], Math.round(sum / n));
    }

    for (const p of sorted) {
      const k = dayKey(new Date(p.date));
      (p as DataPoint & { movingAvg: number }).movingAvg = threeDayMA.get(k) ?? p.value;
    }
    return sorted;
  }, [data]);

  const medDots = useMemo(() => {
    if (chartData.length === 0 || medicationEvents.length === 0) return [];
    return medicationEvents.map((ev) => {
      const t = new Date(ev.taken_at).getTime();
      let idx = chartData.findIndex((d) => new Date(d.date).getTime() >= t);
      if (idx < 0) idx = chartData.length - 1;
      if (idx < 0) idx = 0;
      const point = chartData[idx];
      return {
        ...ev,
        x: point?.displayTime ?? "",
        y: 60,
        color: colorForMed(ev.name),
      };
    });
  }, [chartData, medicationEvents]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <defs>
            <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--health-blue))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--health-blue))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ReferenceArea y1={70} y2={140} fill="hsl(var(--health-green) / 0.12)" stroke="none" />
          <XAxis dataKey="displayTime" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 16, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "var(--card-shadow)" }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string) => [`${value} mg/dL`, name]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.displayTime ?? ""}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#glucoseGradient)"
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="value"
            name={t("chart.bloodGlucose")}
            stroke="hsl(var(--health-blue))"
            strokeWidth={2.5}
            dot={{ fill: "hsl(var(--health-blue))", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "white", stroke: "hsl(var(--health-blue))", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="movingAvg"
            name={t("chart.movingAvg")}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
          {medDots.map((dot, i) => (
            <ReferenceDot
              key={i}
              x={dot.x}
              y={dot.y}
              r={6}
              fill={dot.color}
              stroke={dot.color}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {medicationEvents.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Colored dots = medication taken (by type)
        </p>
      )}
    </div>
  );
}
