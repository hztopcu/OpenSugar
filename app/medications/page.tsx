import { getMedications } from "@/app/actions";
import { MedicationForm } from "@/components/medication-form";
import { MedicationList } from "@/components/medication-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function MedicationsPage() {
  const medications = await getMedications();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="px-4 pt-6 md:px-6 md:pt-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Medications
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your medication list
        </p>
      </div>

      <div className="space-y-6 px-4 pb-24 md:px-6 md:pb-8">
        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold tracking-tight">Add medication</h2>
          </CardHeader>
          <CardContent>
            <MedicationForm />
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-smooth hover:shadow-soft">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold tracking-tight">Your medications</h2>
          </CardHeader>
          <CardContent>
            <MedicationList medications={medications} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
