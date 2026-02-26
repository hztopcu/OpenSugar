import { getReportData, getLabResults } from "@/app/actions";
import { ReportPageContent } from "@/components/report-page-content";

export default async function ReportPage() {
  const [reportData, labResultsFull] = await Promise.all([
    getReportData(),
    getLabResults(),
  ]);
  return (
    <ReportPageContent reportData={reportData} labResultsFull={labResultsFull} />
  );
}
