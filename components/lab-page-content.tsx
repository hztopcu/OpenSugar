"use client";

import { LabResultForm } from "@/components/lab-result-form";
import { LabResultsTable } from "@/components/lab-results-table";
import { Hba1cChart } from "@/components/hba1c-chart";
import { LabAnalysisView } from "@/components/lab-analysis-view";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import type { LabResultRow } from "@/lib/db";

export function LabPageContent({ results }: { results: LabResultRow[] }) {
  const { t } = useLanguage();
  const hasHba1c = results.some((r) => r.test_name === "HbA1c");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="px-4 pt-6 md:px-6 md:pt-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {t("lab.title")}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("lab.subtitle")}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("lab.uploadViewOld")}</p>
      </div>

      <div className="space-y-6 px-4 pb-24 md:px-6 md:pb-8">
        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader>
            <span className="font-semibold">{t("lab.addResult")}</span>
          </CardHeader>
          <CardContent>
            <LabResultForm />
          </CardContent>
        </Card>

        <LabAnalysisView results={results} />

        {hasHba1c && (
          <Card className="overflow-hidden transition-smooth hover:shadow-soft">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold tracking-tight">{t("lab.hba1cProgression")}</h2>
              <p className="text-muted-foreground text-sm font-normal">
                {t("lab.hba1cProgressionHint")}
              </p>
            </CardHeader>
            <CardContent>
              <Hba1cChart results={results} />
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold tracking-tight">{t("lab.history")}</h2>
          </CardHeader>
          <CardContent>
            <LabResultsTable results={results} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
