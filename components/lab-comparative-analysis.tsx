"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface ComparisonRow {
  test_name: string;
  previous: number;
  latest: number;
  unit: string | null;
  trend: "improved" | "worsened" | "unchanged";
}

export function LabComparativeAnalysis({
  comparisonData,
}: {
  comparisonData: ComparisonRow[];
}) {
  const { t } = useLanguage();

  const trendConfig = {
    improved: { color: "text-green-600", Icon: ArrowDown },
    worsened: { color: "text-red-600", Icon: ArrowUp },
    unchanged: { color: "text-muted-foreground", Icon: Minus },
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("lab.test")}</TableHead>
            <TableHead>{t("lab.value")} ({t("lab.prev")})</TableHead>
            <TableHead>{t("lab.value")} ({t("lab.latest")})</TableHead>
            <TableHead className="w-28">{t("lab.target")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonData.map((row) => {
            const delta = row.latest - row.previous;
            const { color, Icon } = trendConfig[row.trend];
            const trendKey =
              row.trend === "improved"
                ? "lab.improved"
                : row.trend === "worsened"
                  ? "lab.worsened"
                  : "lab.unchanged";
            return (
              <TableRow key={row.test_name}>
                <TableCell className="font-medium">{row.test_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.previous} {row.unit ?? ""}
                </TableCell>
                <TableCell>
                  {row.latest} {row.unit ?? ""}
                </TableCell>
                <TableCell className={cn("flex items-center gap-1", color)}>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{t(trendKey)}</span>
                  {delta !== 0 && (
                    <span className="text-xs">
                      ({delta > 0 ? "+" : ""}
                      {delta})
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
