import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Med {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  created_at: Date;
}

export function MedicationList({ medications }: { medications: Med[] }) {
  if (medications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No medications added yet. Use the form above to add one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>
                {m.dosage} {m.unit}
              </TableCell>
              <TableCell>{m.frequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
