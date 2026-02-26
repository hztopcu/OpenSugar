"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLanguage } from "@/components/language-provider";

export function ExportPdfButton() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const el = document.getElementById("report-content");
    if (!el) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      if (h > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        pdf.addImage(img, "PNG", 0, -(pdf.internal.pageSize.getHeight()), w, h);
      }
      pdf.save("opensugar-report.pdf");
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      <FileDown className="mr-2 h-4 w-4" />
      {loading ? t("report.exporting") : t("report.exportPdf")}
    </Button>
  );
}
