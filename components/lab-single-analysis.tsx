"use client";

import { useLanguage } from "@/components/language-provider";
import { interpretValue } from "@/lib/lab-reference-ranges";
import type { LabResultRow } from "@/lib/db";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  good: "text-green-600",
  attention: "text-amber-600",
  high: "text-red-600",
  low: "text-blue-600",
};

export function LabSingleAnalysis({ results }: { results: LabResultRow[] }) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((r) => {
        const interp = interpretValue(r.test_name, r.value);
        const statusKey = interp ? `lab.${interp}` : null;
        return (
          <div
            key={`${r.test_name}-${r.test_date}-${r.id}`}
            className="rounded-lg border border-border bg-muted/20 p-3"
          >
            <p className="text-xs text-muted-foreground">{r.test_name}</p>
            <p className="text-lg font-semibold">
              {r.value} {r.unit ?? ""}
            </p>
            {statusKey && (
              <p
                className={cn(
                  "text-sm font-medium capitalize",
                  statusColors[interp!]
                )}
              >
                {t(statusKey)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
