"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface GlucoseRow {
  id: string;
  value: number;
  type: string;
  notes: string | null;
  created_at: Date;
}

interface MedLogRow {
  id: string;
  medication_id: string;
  taken_at: Date;
  notes: string | null;
  medication_name?: string;
}

function getStatus(value: number): "low" | "normal" | "high" {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  return "high";
}

const statusClass: Record<string, string> = {
  low: "text-blue-600 font-medium",
  normal: "text-green-600 font-medium",
  high: "text-red-600 font-medium",
};

export function ReportTable({
  glucose,
  medicationLogs,
}: {
  glucose: GlucoseRow[];
  medicationLogs: MedLogRow[];
}) {
  const { t } = useLanguage();
  // Merge and sort by date descending
  const glucoseEntries = glucose.map((g) => ({
    type: "glucose" as const,
    date: new Date(g.created_at),
    value: g.value,
    typeLabel: g.type,
    notes: g.notes,
    status: getStatus(g.value),
  }));
  const medEntries = medicationLogs.map((m) => ({
    type: "medication" as const,
    date: new Date(m.taken_at),
    value: null as number | null,
    typeLabel: m.medication_name ?? "—",
    notes: m.notes,
    status: null as string | null,
  }));
  const combined = [...glucoseEntries, ...medEntries].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <Card>
      <CardHeader>
        <span className="font-semibold">{t("report.combinedLog")}</span>
        <p className="text-muted-foreground font-normal text-sm">
          {t("report.combinedLogHint")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("report.dateTime")}</TableHead>
                <TableHead>{t("report.type")}</TableHead>
                <TableHead>{t("report.valueMedication")}</TableHead>
                <TableHead>{t("report.notes")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combined.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    {t("report.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                combined.map((row, i) => (
                  <TableRow key={`${row.type}-${row.date.getTime()}-${i}`}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {row.date.toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      {row.type === "glucose" ? t("report.glucose") : t("report.medication")}
                    </TableCell>
                    <TableCell className={cn(row.status && statusClass[row.status])}>
                      {row.type === "glucose"
                        ? `${row.value} mg/dL`
                        : row.typeLabel}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {row.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
