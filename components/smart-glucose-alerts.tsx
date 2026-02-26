"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

interface SmartGlucoseAlertsProps {
  value: number | undefined;
}

export function SmartGlucoseAlerts({ value }: SmartGlucoseAlertsProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (value === undefined) return;
    if (value < 70) {
      toast.error(t("alert.hypo"), {
        description: t("alert.hypoDesc"),
        duration: 10000,
      });
    } else if (value > 180) {
      toast.warning(t("alert.hyper"), {
        description: t("alert.hyperDesc"),
        duration: 8000,
      });
    }
  }, [value, t]);

  return null;
}
