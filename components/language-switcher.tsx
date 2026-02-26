"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
      {(["en", "tr"] as Locale[]).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          aria-label={loc === "en" ? "English" : "Turkish"}
          className={cn(
            "min-w-[2.25rem] rounded-md px-2.5 py-1.5 text-sm font-medium transition-smooth",
            locale === loc
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
