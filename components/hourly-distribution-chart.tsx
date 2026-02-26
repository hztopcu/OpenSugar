"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/components/language-provider";

interface Point {
  created_at: Date;
  value: number;
}

export function HourlyDistributionChart({ data }: { data: Point[] }) {
  const { t } = useLanguage();
  const hourly = useMemo(() => {
    const byHour = Array.from({ length: 24 }, (_, h) => ({ hour: h, sum: 0, count: 0 }));
    for (const p of data) {
      const h = new Date(p.created_at).getHours();
      byHour[h].sum += p.value;
      byHour[h].count += 1;
    }
    return byHour.map(({ hour, sum, count }) => ({
      hour: `${hour}:00`,
      avg: count > 0 ? Math.round(sum / count) : 0,
      count,
    }));
  }, [data]);

  const hasAny = hourly.some((d) => d.count > 0);
  if (!hasAny) {
    return (
      <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
        {t("chart.noHourlyData")}
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hourly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
            formatter={(value: number) => [value, t("chart.avgMgDl")]}
            labelFormatter={(label) => t("chart.hourLabel").replace("{{label}}", label)}
          />
          <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={t("chart.avgGlucose")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
