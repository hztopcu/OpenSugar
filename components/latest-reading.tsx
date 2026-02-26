import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Droplet } from "lucide-react";

type ReadingStatus = "low" | "normal" | "high";

function getStatus(value: number): ReadingStatus {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  return "high";
}

const statusConfig: Record<
  ReadingStatus,
  { label: string; className: string; bgClassName: string }
> = {
  low: {
    label: "Low",
    className: "text-blue-600",
    bgClassName: "bg-blue-50 border-blue-200",
  },
  normal: {
    label: "Normal",
    className: "text-green-600",
    bgClassName: "bg-green-50 border-green-200",
  },
  high: {
    label: "High",
    className: "text-red-600",
    bgClassName: "bg-red-50 border-red-200",
  },
};

interface LatestReadingProps {
  value: number;
  type: string;
  createdAt: Date;
}

export function LatestReading({ value, type, createdAt }: LatestReadingProps) {
  const status = getStatus(value);
  const config = statusConfig[status];
  const time = new Date(createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={cn("overflow-hidden", config.bgClassName)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Droplet className="h-4 w-4" />
          <span className="text-sm font-medium">Latest Reading</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {type} · {time}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-4xl font-bold tabular-nums", config.className)}>
            {value}
          </span>
          <span className="text-muted-foreground">mg/dL</span>
        </div>
        <p className={cn("mt-1 text-sm font-medium", config.className)}>
          {config.label}
        </p>
      </CardContent>
    </Card>
  );
}
