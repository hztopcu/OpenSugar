"use client";

import { useState } from "react";
import { addGlucoseLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SmartGlucoseAlerts } from "@/components/smart-glucose-alerts";
import { useLanguage } from "@/components/language-provider";

const TYPE_OPTIONS = [
  { value: "Fasting", labelKey: "add.typeFasting" },
  { value: "Post-Meal", labelKey: "add.typeAfterMeal" },
  { value: "Bedtime", labelKey: "add.typeBedtime" },
  { value: "Other", labelKey: "add.typeOther" },
] as const;

type FormState = {
  error?: string;
  success?: boolean;
  value?: number;
};

const initialState: FormState = {};

export function AddGlucoseForm() {
  const { t } = useLanguage();
  const [state, setState] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Fasting");
  const [measuredAt, setMeasuredAt] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", selectedType);
    setPending(true);
    setState({});
    try {
      const result = await addGlucoseLog(state, formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  const [valueInput, setValueInput] = useState<string>("");
  const valueNum = valueInput ? parseInt(valueInput, 10) : state?.value;
  const showHighAlert =
    (typeof valueNum === "number" && Number.isFinite(valueNum) && valueNum > 180) ||
    (state?.success && typeof state.value === "number" && state.value > 180);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {t("add.measurementType")}
        </Label>
        <div
          role="group"
          aria-label={t("dashboard.measurementType")}
          className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1"
        >
          {TYPE_OPTIONS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedType(value)}
              className={cn(
                "flex-1 rounded-lg py-3 text-sm font-medium transition-smooth",
                selectedType === value
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
        <input type="hidden" name="type" value={selectedType} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value" className="text-sm font-medium">
          {t("add.bloodGlucoseLabel")}
        </Label>
        <Input
          id="value"
          name="value"
          type="number"
          min={0}
          max={999}
          placeholder={t("add.valuePlaceholder")}
          required
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          className="h-12 text-lg tabular-nums"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="measured_at" className="text-sm font-medium">
          {t("add.dateAndTime")}
        </Label>
        <Input
          id="measured_at"
          name="measured_at"
          type="datetime-local"
          value={measuredAt}
          onChange={(e) => setMeasuredAt(e.target.value)}
          className="h-11"
          required
        />
      </div>

      {showHighAlert && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-medium">{t("add.highReadingTitle")}</p>
          <p className="mt-0.5 text-destructive/90">
            {t("add.highReadingDesc")}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">
          {t("add.notesOptional")}
        </Label>
        <Input
          id="notes"
          name="notes"
          type="text"
          placeholder={t("add.notesPlaceholder")}
          className="h-11"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <>
          <p className="text-sm text-success">{t("add.saved")}</p>
          {state.value != null && <SmartGlucoseAlerts value={state.value} />}
        </>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full text-base font-medium"
      >
        {pending ? t("add.saving") : t("add.saveReading")}
      </Button>
    </form>
  );
}
