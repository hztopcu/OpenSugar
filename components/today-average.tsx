import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface TodayAverageProps {
  dailyAverage: number | null;
  dailyCount: number;
  last7DayAverage: number | null;
  last7DayCount: number;
}

export function TodayAverage({
  dailyAverage,
  dailyCount,
  last7DayAverage,
  last7DayCount,
}: TodayAverageProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">Averages</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Daily Average</p>
          {dailyCount === 0 ? (
            <p className="text-muted-foreground text-sm">No readings today</p>
          ) : (
            <p className="text-2xl font-bold tabular-nums">
              {Math.round(dailyAverage ?? 0)} <span className="text-sm font-normal text-muted-foreground">mg/dL</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">{dailyCount} reading{dailyCount !== 1 ? "s" : ""} today</p>
        </div>
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground">Last 7-Day Average</p>
          {last7DayCount === 0 ? (
            <p className="text-muted-foreground text-sm">No data</p>
          ) : (
            <p className="text-2xl font-bold tabular-nums">
              {Math.round(last7DayAverage ?? 0)} <span className="text-sm font-normal text-muted-foreground">mg/dL</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">{last7DayCount} reading{last7DayCount !== 1 ? "s" : ""} in 7 days</p>
        </div>
      </CardContent>
    </Card>
  );
}
