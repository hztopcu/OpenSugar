"use client";

import { AppNav } from "@/components/app-nav";
import { useLanguage } from "@/components/language-provider";

export function DashboardHeader() {
  const { t } = useLanguage();
  return (
    <header className="text-center">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t("dashboard.title")}
      </h1>
      <p className="mt-1 text-muted-foreground">{t("dashboard.subtitle")}</p>
      <div className="mt-4 flex justify-center">
        <AppNav />
      </div>
    </header>
  );
}
