"use client";

import { useState } from "react";
import { addMedicationLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
        <Label htmlFor="medication_id">Medication</Label>
        <select
          id="medication_id"
          name="medication_id"
          required
          aria-label="Medication"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <option value="">Select medication</option>
          {medications.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} – {m.dosage} {m.unit} ({m.frequency})
            </option>
          ))}
        </select>
        {medications.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add medications on the Medications page first.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="med_notes">Notes (optional)</Label>
        <Input id="med_notes" name="notes" type="text" placeholder="e.g. With breakfast" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Logged.</p>}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Log medication"}
      </Button>
    </form>
  );
}
