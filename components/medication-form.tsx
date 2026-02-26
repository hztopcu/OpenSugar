"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addMedication } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

const initialState = {
  error: undefined as string | undefined,
  success: undefined as boolean | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? t("med.saving") : t("med.addMedication")}
    </Button>
  );
}

export function MedicationForm() {
  const { t } = useLanguage();
  const [state, formAction] = useFormState(addMedication, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("med.name")}</Label>
          <Input id="name" name="name" placeholder={t("med.placeholderName")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosage">{t("med.dosage")}</Label>
          <Input id="dosage" name="dosage" placeholder={t("med.placeholderDosage")} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="unit">{t("med.unit")}</Label>
          <select
            id="unit"
            name="unit"
            required
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <option value="">{t("med.select")}</option>
            <option value="mg">{t("med.mg")}</option>
            <option value="units">{t("med.units")}</option>
            <option value="mcg">{t("med.mcg")}</option>
            <option value="g">{t("med.g")}</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">{t("med.frequency")}</Label>
          <select
            id="frequency"
            name="frequency"
            required
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <option value="">{t("med.select")}</option>
            <option value="Daily">{t("med.daily")}</option>
            <option value="Twice daily">{t("med.twiceDaily")}</option>
            <option value="As Needed">{t("med.asNeeded")}</option>
            <option value="With meals">{t("med.withMeals")}</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{t("med.added")}</p>}
      <SubmitButton />
    </form>
  );
}
