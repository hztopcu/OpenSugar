"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { compareTrend } from "@/lib/lab-reference-ranges";
import type { LabResultRow } from "@/lib/db";

interface ComparisonRow {
  test_name: string;
  previous: number;
  latest: number;
  unit: string | null;
  trend: "improved" | "worsened" | "unchanged";
}

export function LabSummaryBullets({
  singleDateResults,
  comparisonData,
  uniqueDates,
  titleKey = "lab.summaryTitle",
}: {
  singleDateResults: LabResultRow[];
  comparisonData: ComparisonRow[];
  uniqueDates: string[];
  titleKey?: string;
}) {
  const { t, locale } = useLanguage();

  const bullets = useMemo(() => {
    const list: string[] = [];
    if (uniqueDates.length === 1 && singleDateResults.length > 0) {
      if (locale === "en") {
        list.push(
          `You have one lab result set (${uniqueDates[0]}). Review the detailed analysis below for each marker.`
        );
        const hba1c = singleDateResults.find((r) => r.test_name === "HbA1c");
        if (hba1c) {
          if (hba1c.value < 5.7)
            list.push("Your HbA1c is in the normal range. Good job.");
          else if (hba1c.value < 6.5)
            list.push(
              "Your HbA1c is in the prediabetic range. Consider lifestyle changes and follow-up tests."
            );
          else
            list.push(
              "Your HbA1c suggests diabetes range. Please follow your doctor's plan."
            );
        }
      } else {
        list.push(
          `Tek tahlil setiniz var (${uniqueDates[0]}). Aşağıdaki detaylı analizi inceleyin.`
        );
        const hba1c = singleDateResults.find((r) => r.test_name === "HbA1c");
        if (hba1c) {
          if (hba1c.value < 5.7)
            list.push("HbA1c değeriniz normal aralıkta.");
          else if (hba1c.value < 6.5)
            list.push(
              "HbA1c prediyabet aralığında. Yaşam tarzı değişikliği ve takip tahlilleri önerilir."
            );
          else list.push("HbA1c diyabet aralığında. Doktor planınıza uyun.");
        }
      }
      return list;
    }
    if (uniqueDates.length >= 2 && comparisonData.length > 0) {
      for (const row of comparisonData) {
        const delta = row.latest - row.previous;
        const trend = compareTrend(row.test_name, row.previous, row.latest);
        const unit = row.unit ?? "";
        if (locale === "en") {
          if (trend === "improved") {
            list.push(
              `Your ${row.test_name} has improved (${row.previous} → ${row.latest} ${unit}). That's a positive change.`
            );
          } else if (trend === "worsened") {
            list.push(
              `Your ${row.test_name} has increased since the last test (${row.previous} → ${row.latest} ${unit}). Consider discussing with your doctor.`
            );
          } else {
            list.push(
              `Your ${row.test_name} is unchanged (${row.latest} ${unit}).`
            );
          }
        } else {
          if (trend === "improved") {
            list.push(
              `${row.test_name} iyileşti (${row.previous} → ${row.latest} ${unit}).`
            );
          } else if (trend === "worsened") {
            list.push(
              `${row.test_name} son tahlile göre yükseldi (${row.previous} → ${row.latest} ${unit}). Doktorunuzla görüşmeniz iyi olur.`
            );
          } else {
            list.push(`${row.test_name} değişmedi (${row.latest} ${unit}).`);
          }
        }
      }
      return list;
    }
    return list;
  }, [
    singleDateResults,
    comparisonData,
    uniqueDates,
    locale,
  ]);

  if (bullets.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <span className="font-semibold">{t(titleKey)}</span>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {bullets.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
