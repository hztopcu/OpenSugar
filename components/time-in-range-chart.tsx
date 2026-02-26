"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  hypo: "hsl(var(--health-blue))",
  inRange: "hsl(var(--health-green))",
  slightlyHigh: "hsl(var(--health-orange))",
  high: "hsl(var(--health-pink-red))",
};

interface TiRData {
  hypo: number;
  inRange: number;
  slightlyHigh: number;
  high: number;
}

export function TimeInRangeChart({ data }: { data: TiRData }) {
  const total = data.hypo + data.inRange + data.slightlyHigh + data.high;
  const chartData = [
    { name: "Below (<70)", value: data.hypo, color: COLORS.hypo },
    { name: "In range", value: data.inRange, color: COLORS.inRange },
    { name: "Slightly high", value: data.slightlyHigh, color: COLORS.slightlyHigh },
    { name: "High", value: data.high, color: COLORS.high },
  ].filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
        No glucose data for Time-in-Range
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={78}
            paddingAngle={1}
            dataKey="value"
            nameKey="name"
            label={false}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, ""]}
            contentStyle={{ borderRadius: 16, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "var(--card-shadow)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
