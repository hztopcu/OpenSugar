import { getMedications } from "@/app/actions";
import { AddPageContent } from "@/components/add-page-content";

export default async function AddPage() {
  const medications = await getMedications();
  return <AddPageContent medications={medications} />;
}
