"use client";

import { AddGlucoseForm } from "@/components/add-glucose-form";
import { AddMedicationLogForm } from "@/components/add-medication-log-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

interface Med {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
}

export function AddPageContent({ medications }: { medications: Med[] }) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <div className="px-4 pt-6 md:px-6 md:pt-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {t("add.title")}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t("add.subtitle")}
        </p>
      </div>

      <div className="space-y-6 px-4 pb-24 md:px-6 md:pb-8">
        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("add.glucoseCard")}
            </h2>
          </CardHeader>
          <CardContent>
            <AddGlucoseForm />
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("add.medicationCard")}
            </h2>
            <p className="text-muted-foreground text-sm font-normal">
              {t("add.medicationCardHint")}
            </p>
          </CardHeader>
          <CardContent>
            <AddMedicationLogForm medications={medications} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
