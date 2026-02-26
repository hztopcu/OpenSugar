"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

interface LabLatest {
  test_name: string;
  value: number;
  unit: string | null;
  test_date: string;
}

export function ReportLabSummary({ results }: { results: LabLatest[] }) {
  const { t } = useLanguage();

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <span className="font-semibold">{t("report.bloodLabResults")}</span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("report.noLabData")}</p>
        </CardContent>
      </Card>
    );
  }

  const labels: Record<string, string> = {
    HbA1c: t("report.labHbA1c"),
    HDL: t("report.labHdl"),
    LDL: t("report.labLdl"),
    Triglycerides: t("report.labTriglycerides"),
    BP_Systolic: t("report.labBpSystolic"),
    BP_Diastolic: t("report.labBpDiastolic"),
    Glucose: t("report.glucose"),
  };

  return (
    <Card>
      <CardHeader>
        <span className="font-semibold">{t("report.latestLabResults")}</span>
        <p className="text-muted-foreground font-normal text-sm">
          {t("report.mostRecentPerTest")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div key={r.test_name}>
              <p className="text-muted-foreground text-xs">
                {labels[r.test_name] ?? r.test_name}
              </p>
              <p className="text-lg font-semibold">
                {r.value} {r.unit ?? ""}
              </p>
              <p className="text-muted-foreground text-xs">{r.test_date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
