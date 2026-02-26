"use client";

import { useState } from "react";
import { addLabResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";

type FormState = { error?: string; success?: boolean };

const initialState: FormState = {};

export function LabResultForm() {
  const { t } = useLanguage();
  const [state, setState] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setPending(true);
    setState({});
    try {
      const result = await addLabResult(state, formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test_date">{t("lab.testDate")}</Label>
        <Input id="test_date" name="test_date" type="date" required defaultValue={today} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hba1c">{t("lab.hba1c")}</Label>
          <Input id="hba1c" name="hba1c" type="number" step="0.1" min={0} max={20} placeholder={t("lab.hba1cPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hdl">{t("lab.hdl")}</Label>
          <Input id="hdl" name="hdl" type="number" min={0} placeholder={t("lab.hdlPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ldl">{t("lab.ldl")}</Label>
          <Input id="ldl" name="ldl" type="number" min={0} placeholder={t("lab.ldlPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="triglycerides">{t("lab.triglycerides")}</Label>
          <Input id="triglycerides" name="triglycerides" type="number" min={0} placeholder={t("lab.trigPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bp_systolic">{t("lab.bpSystolic")}</Label>
          <Input id="bp_systolic" name="bp_systolic" type="number" min={0} placeholder={t("lab.bpPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bp_diastolic">{t("lab.bpDiastolic")}</Label>
          <Input id="bp_diastolic" name="bp_diastolic" type="number" min={0} placeholder={t("lab.bpPlaceholder")} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t("lab.enterOneMetric")}</p>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{t("lab.saved")}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? t("lab.saving") : t("lab.saveLabResult")}
      </Button>
    </form>
  );
}
