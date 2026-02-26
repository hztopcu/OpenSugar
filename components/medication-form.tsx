"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addMedication } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState = {
  error: undefined as string | undefined,
  success: undefined as boolean | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Add medication"}
    </Button>
  );
}

export function MedicationForm() {
  const [state, formAction] = useFormState(addMedication, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="e.g. Metformin" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input id="dosage" name="dosage" placeholder="e.g. 500" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            name="unit"
            required
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <option value="">Select</option>
            <option value="mg">mg</option>
            <option value="units">units</option>
            <option value="mcg">mcg</option>
            <option value="g">g</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <select
            id="frequency"
            name="frequency"
            required
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <option value="">Select</option>
            <option value="Daily">Daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="As Needed">As Needed</option>
            <option value="With meals">With meals</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Added.</p>}
      <SubmitButton />
    </form>
  );
}
