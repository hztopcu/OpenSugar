"use client";

import { useMemo } from "react";
import { ReportTable } from "@/components/report-table";
import { ReportLabSummary } from "@/components/report-lab-summary";
import { ReportTimeInRange } from "@/components/report-time-in-range";
import { ExportPdfButton } from "@/components/export-pdf-button";
import { LabSummaryBullets } from "@/components/lab-summary-bullets";
import { useLanguage } from "@/components/language-provider";
import { compareTrend } from "@/lib/lab-reference-ranges";
import type { LabResultRow } from "@/lib/db";

interface ReportData {
  glucose: { id: string; value: number; type: string; notes: string | null; created_at: Date }[];
  medicationLogs: { id: string; medication_id: string; taken_at: Date; notes: string | null; medication_name?: string }[];
  labResultsLatest: { test_name: string; value: number; unit: string | null; test_date: string }[];
  timeInRange: { hypo: number; inRange: number; slightlyHigh: number; high: number };
}

export function ReportPageContent({
  reportData,
  labResultsFull,
}: {
  reportData: ReportData;
  labResultsFull: LabResultRow[];
}) {
  const { t } = useLanguage();

  const { uniqueDates, singleDateResults, comparisonData } = useMemo(() => {
    const dates = [...new Set(labResultsFull.map((r) => r.test_date))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    const singleDateResults =
      dates.length === 1
        ? labResultsFull.filter((r) => r.test_date === dates[0])
        : [];
    const comparisonData: {
      test_name: string;
      previous: number;
      latest: number;
      unit: string | null;
      trend: "improved" | "worsened" | "unchanged";
    }[] = [];
    if (dates.length >= 2) {
      const latestDate = dates[0];
      const previousDate = dates[1];
      const latestRows = labResultsFull.filter((r) => r.test_date === latestDate);
      const previousRows = labResultsFull.filter((r) => r.test_date === previousDate);
      const testNames = [...new Set(latestRows.map((r) => r.test_name))];
      for (const name of testNames) {
        const prev = previousRows.find((r) => r.test_name === name);
        const lat = latestRows.find((r) => r.test_name === name);
        if (prev && lat) {
          comparisonData.push({
            test_name: name,
            previous: prev.value,
            latest: lat.value,
            unit: lat.unit,
            trend: compareTrend(name, prev.value, lat.value),
          });
        }
      }
    }
    return { uniqueDates: dates, singleDateResults, comparisonData };
  }, [labResultsFull]);

  const showComparativeSummary =
    labResultsFull.length > 0 && (uniqueDates.length === 1 || comparisonData.length > 0);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="px-4 pt-6 md:px-6 md:pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {t("report.title")}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("report.subtitle")}</p>
          </div>
          <ExportPdfButton />
        </div>
      </div>

      <div className="px-4 pb-24 md:px-6 md:pb-8">

        <div id="report-content" className="mt-6 space-y-6">
          <ReportTimeInRange data={reportData.timeInRange} />
          {showComparativeSummary && (
            <LabSummaryBullets
              singleDateResults={singleDateResults}
              comparisonData={comparisonData}
              uniqueDates={uniqueDates}
              titleKey="report.comparativeLabSummary"
            />
          )}
          <ReportLabSummary results={reportData.labResultsLatest} />
          <ReportTable
            glucose={reportData.glucose}
            medicationLogs={reportData.medicationLogs}
          />
        </div>
      </div>
    </div>
  );
}
