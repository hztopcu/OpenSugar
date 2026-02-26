"use client";

import { useState } from "react";
import { addGlucoseLog } from "@/app/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SmartGlucoseAlerts } from "@/components/smart-glucose-alerts";
import { useLanguage } from "@/components/language-provider";
import { Check, Plus } from "lucide-react";

type Segment = "Morning" | "Evening";

export function QuickAddCard() {
  const { t } = useLanguage();
  const [segment, setSegment] = useState<Segment>("Morning");
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertValue, setAlertValue] = useState<number | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = value.trim() ? parseInt(value, 10) : NaN;
    if (!Number.isFinite(num) || num < 0 || num > 999) {
      setError(t("dashboard.enterValueBetween"));
      return;
    }
    setError(null);
    setPending(true);
    setSuccess(false);
    const formData = new FormData();
    formData.set("value", String(num));
    formData.set("type", segment === "Morning" ? "Fasting" : "Post-Meal");
    formData.set("notes", "");
    try {
      const result = await addGlucoseLog({}, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setValue("");
        if (result.value != null) {
          setAlertValue(result.value);
          setTimeout(() => setAlertValue(undefined), 500);
        }
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="overflow-hidden opacity-0 animate-fade-in-up hover-lift transition-smooth">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-blue))]/20">
            <Plus className="h-5 w-5 text-[hsl(var(--health-blue))]" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{t("dashboard.quickAdd")}</h2>
            <p className="text-sm text-muted-foreground">{t("dashboard.quickAddHint")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 rounded-2xl bg-muted/40 p-1">
            {(["Morning", "Evening"] as Segment[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                className={cn(
                  "flex-1 rounded-xl py-3 text-sm font-semibold transition-smooth",
                  segment === s
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "Morning" ? t("dashboard.morning") : t("dashboard.evening")}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={999}
                placeholder="mg/dL"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-14 text-2xl font-bold tabular-nums text-center rounded-2xl"
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className={cn(
                "h-14 rounded-2xl px-6 font-semibold transition-smooth active:scale-[0.98]",
                success && "animate-save-bounce",
                success
                  ? "bg-[hsl(var(--health-green))] text-white shadow-sm"
                  : "bg-gradient-to-br from-[hsl(var(--health-blue))] to-[hsl(var(--health-evening))] text-white shadow-card hover:opacity-95"
              )}
            >
              {pending ? (
                "…"
              ) : success ? (
                <Check className="h-6 w-6" />
              ) : (
                t("dashboard.save")
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </form>
        {alertValue != null && <SmartGlucoseAlerts value={alertValue} />}
      </CardContent>
    </Card>
  );
}
