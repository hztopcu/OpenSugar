"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LabResultRow } from "@/lib/db";
import { useLanguage } from "@/components/language-provider";

export function LabResultsTable({ results }: { results: LabResultRow[] }) {
  const { t } = useLanguage();

  if (results.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        {t("lab.noResults")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("lab.date")}</TableHead>
            <TableHead>{t("lab.test")}</TableHead>
            <TableHead>{t("lab.value")}</TableHead>
            <TableHead>{t("lab.unit")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {r.test_date}
              </TableCell>
              <TableCell className="font-medium">{r.test_name}</TableCell>
              <TableCell>{r.value}</TableCell>
              <TableCell className="text-muted-foreground">{r.unit ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
