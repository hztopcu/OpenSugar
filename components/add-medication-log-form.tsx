"use client";

import { useState } from "react";
import { addMedicationLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

interface Med {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
}

type FormState = {
  error?: string;
  success?: boolean;
};

const initialState: FormState = {};

export function AddMedicationLogForm({
  medications,
}: {
  medications: Med[];
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setPending(true);
    setState({});
    try {
      const result = await addMedicationLog(state, formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medication_id">{t("add.medication")}</Label>
        <select
          id="medication_id"
          name="medication_id"
          required
          aria-label={t("add.medication")}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <option value="">{t("add.selectMedication")}</option>
          {medications.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} – {m.dosage} {m.unit} ({m.frequency})
            </option>
          ))}
        </select>
        {medications.length === 0 && (
          <p className="text-xs text-muted-foreground">
            {t("add.addMedsFirst")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="med_notes">{t("add.notesOptional")}</Label>
        <Input id="med_notes" name="notes" type="text" placeholder={t("add.notesPlaceholderMeal")} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{t("add.logged")}</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? t("add.saving") : t("add.logMedication")}
      </Button>
    </form>
  );
}
