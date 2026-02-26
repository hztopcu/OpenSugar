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
          Measurement type
        </Label>
        <div
          role="group"
          aria-label="Measurement type"
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
          Blood glucose (mg/dL)
        </Label>
        <Input
          id="value"
          name="value"
          type="number"
          min={0}
          max={999}
          placeholder="e.g. 98"
          required
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          className="h-12 text-lg tabular-nums"
        />
      </div>

      {showHighAlert && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-medium">High reading</p>
          <p className="mt-0.5 text-destructive/90">
            This value is above 180 mg/dL. Consider drinking water and
            consulting your care plan if this persists.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">
          Notes (optional)
        </Label>
        <Input
          id="notes"
          name="notes"
          type="text"
          placeholder="e.g. After breakfast"
          className="h-11"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <>
          <p className="text-sm text-success">Saved.</p>
          {state.value != null && <SmartGlucoseAlerts value={state.value} />}
        </>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full text-base font-medium"
      >
        {pending ? "Saving…" : "Save reading"}
      </Button>
    </form>
  );
}
