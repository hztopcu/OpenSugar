"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "created_at" | "value" | "type";
type SortDir = "asc" | "desc";

interface LogRow {
  id: string;
  value: number;
  type: string;
  notes: string | null;
  created_at: Date;
}

interface LogTableProps {
  logs: LogRow[];
}

function getStatus(value: number): "low" | "normal" | "high" {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  return "high";
}

const statusClass: Record<string, string> = {
  low: "text-blue-600 font-medium",
  normal: "text-green-600 font-medium",
  high: "text-red-600 font-medium",
};

export function LogTable({ logs }: LogTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedLogs = useMemo(() => {
    const arr = [...logs];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at") {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortKey === "value") {
        cmp = a.value - b.value;
      } else {
        cmp = (a.type || "").localeCompare(b.type || "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [logs, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <span className="font-semibold">History</span>
        <p className="text-sm text-muted-foreground">
          Sort by column for doctor review
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => toggleSort("created_at")}
                  >
                    Date & Time
                    <SortIcon column="created_at" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => toggleSort("value")}
                  >
                    Value (mg/dL)
                    <SortIcon column="value" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => toggleSort("type")}
                  >
                    Type
                    <SortIcon column="type" />
                  </Button>
                </TableHead>
                <TableHead className="max-w-[200px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No logs yet. Add a reading above.
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs.map((row) => {
                  const status = getStatus(row.value);
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(row.created_at).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell className={cn(statusClass[status])}>
                        {row.value}
                      </TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {row.notes || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
