"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { LabResultRow } from "@/lib/db";
import { useLanguage } from "@/components/language-provider";

export function Hba1cChart({ results }: { results: LabResultRow[] }) {
  const { t } = useLanguage();
  const data = useMemo(() => {
    const hba1c = results.filter((r) => r.test_name === "HbA1c");
    return hba1c
      .sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
      .map((r) => ({
        date: new Date(r.test_date).toLocaleDateString(undefined, { month: "short", year: "2-digit", day: "numeric" }),
        hba1c: Number(r.value),
        fullDate: r.test_date,
      }));
  }, [results]);

  if (data.length === 0) return null;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <ReferenceLine y={7} stroke="hsl(var(--destructive))" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis domain={[4, 14]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip
            contentStyle={{ borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
            formatter={(value: number) => [`${value}%`, "HbA1c"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
          />
          <Line
            type="monotone"
            dataKey="hba1c"
            name="HbA1c"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-muted-foreground">{t("chart.hba1cTarget")}</p>
    </div>
  );
}
