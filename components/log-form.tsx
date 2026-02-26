"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addGlucoseLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = { error: undefined as string | undefined, success: undefined as boolean | undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save Reading"}
    </Button>
  );
}

export function LogForm() {
  const [state, formAction] = useFormState(addGlucoseLog, initialState);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="font-semibold">Add Reading</span>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">Blood glucose (mg/dL)</Label>
              <Input
                id="value"
                name="value"
                type="number"
                min={0}
                max={999}
                placeholder="e.g. 98"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                required
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                )}
              >
                <option value="">Select type</option>
                <option value="Fasting">Fasting</option>
                <option value="Pre-Meal">Pre-Meal</option>
                <option value="Post-Meal">Post-Meal</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              name="notes"
              type="text"
              placeholder="e.g. After breakfast"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-green-600">Saved successfully.</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
