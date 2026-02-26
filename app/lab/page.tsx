import { getLabResults } from "@/app/actions";
import { LabPageContent } from "@/components/lab-page-content";

export default async function LabPage() {
  const results = await getLabResults();
  return <LabPageContent results={results} />;
}
