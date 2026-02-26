"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { interpretValue, compareTrend } from "@/lib/lab-reference-ranges";
import type { LabResultRow } from "@/lib/db";
import { LabSingleAnalysis } from "./lab-single-analysis";
import { LabComparativeAnalysis } from "./lab-comparative-analysis";
import { LabSummaryBullets } from "./lab-summary-bullets";

export function LabAnalysisView({ results }: { results: LabResultRow[] }) {
  const { t } = useLanguage();

  const { uniqueDates, singleDateResults, comparisonData } = useMemo(() => {
    const dates = [...new Set(results.map((r) => r.test_date))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    const singleDateResults =
      dates.length === 1
        ? results.filter((r) => r.test_date === dates[0])
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
      const latestRows = results.filter((r) => r.test_date === latestDate);
      const previousRows = results.filter((r) => r.test_date === previousDate);
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
  }, [results]);

  const hasSingle = uniqueDates.length === 1 && singleDateResults.length > 0;
  const hasComparative = uniqueDates.length >= 2 && comparisonData.length > 0;

  if (results.length === 0) return null;

  return (
    <div className="space-y-6">
      <LabSummaryBullets
        singleDateResults={singleDateResults}
        comparisonData={comparisonData}
        uniqueDates={uniqueDates}
      />

      {hasSingle && (
        <Card>
          <CardHeader>
            <span className="font-semibold">{t("lab.detailedAnalysis")}</span>
          </CardHeader>
          <CardContent>
            <LabSingleAnalysis results={singleDateResults} />
          </CardContent>
        </Card>
      )}

      {hasComparative && (
        <Card>
          <CardHeader>
            <span className="font-semibold">{t("lab.comparativeAnalysis")}</span>
          </CardHeader>
          <CardContent>
            <LabComparativeAnalysis comparisonData={comparisonData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
