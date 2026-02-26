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
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp, List } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SortKey = "created_at" | "value" | "type";
type SortDir = "asc" | "desc";

interface LogRow {
  id: string;
  value: number;
  type: string;
  notes: string | null;
  created_at: Date;
}

function getStatus(value: number): "low" | "normal" | "slightly_high" | "high" {
  if (value < 70) return "low";
  if (value <= 140) return "normal";
  if (value <= 180) return "slightly_high";
  return "high";
}

const statusClass: Record<string, string> = {
  low: "text-[hsl(var(--health-blue))] font-semibold",
  normal: "text-[hsl(var(--health-green))] font-semibold",
  slightly_high: "text-[hsl(var(--health-orange))] font-semibold",
  high: "text-[hsl(var(--health-pink-red))] font-semibold",
};

const statusDotClass: Record<string, string> = {
  low: "bg-[hsl(var(--health-blue))]",
  normal: "bg-[hsl(var(--health-green))]",
  slightly_high: "bg-[hsl(var(--health-orange))]",
  high: "bg-[hsl(var(--health-pink-red))]",
};

const statusTintClass: Record<string, string> = {
  low: "bg-[hsl(var(--health-blue))]/8 border-[hsl(var(--health-blue))]/20",
  normal: "bg-[hsl(var(--health-green))]/8 border-[hsl(var(--health-green))]/20",
  slightly_high: "bg-[hsl(var(--health-orange))]/8 border-[hsl(var(--health-orange))]/20",
  high: "bg-[hsl(var(--health-pink-red))]/8 border-[hsl(var(--health-pink-red))]/20",
};

export function HistorySection({ logs }: { logs: LogRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

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

  const empty = sortedLogs.length === 0;

  return (
    <Card className="overflow-hidden opacity-0 animate-fade-in-up animate-fade-in-up-delay-5 transition-smooth hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--health-evening))]/20">
            <List className="h-5 w-5 text-[hsl(var(--health-evening))]" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">History</h2>
            <p className="text-sm text-muted-foreground">
              Date & time · Value · Type · Notes
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">No logs yet</p>
            <Link
              href="/add"
              className="mt-3 text-sm font-semibold text-[hsl(var(--health-blue))] hover:underline"
            >
              Add your first reading
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSort("created_at")}
                      >
                        Date & time
                        <SortIcon column="created_at" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSort("value")}
                      >
                        Value
                        <SortIcon column="value" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-8 font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSort("type")}
                      >
                        Type
                        <SortIcon column="type" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-muted-foreground">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((row) => {
                    const status = getStatus(row.value);
                    return (
                      <TableRow
                        key={row.id}
                        className="transition-smooth hover:bg-muted/40"
                      >
                        <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                          {new Date(row.created_at).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className={cn("font-semibold", statusClass[status])}>
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                statusDotClass[status]
                              )}
                              aria-hidden
                            />
                            {row.value} mg/dL
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{row.type}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                          {row.notes || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2 md:hidden">
              {sortedLogs.map((row) => {
                const status = getStatus(row.value);
                const isExpanded = expandedMobile === row.id;
                return (
                  <Card
                    key={row.id}
                    className={cn(
                      "overflow-hidden border transition-smooth rounded-2xl",
                      statusTintClass[status]
                    )}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-4 text-left"
                      onClick={() =>
                        setExpandedMobile(isExpanded ? null : row.id)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "h-3 w-3 shrink-0 rounded-full",
                            statusDotClass[status]
                          )}
                          aria-hidden
                        />
                        <span
                          className={cn(
                            "text-lg font-bold tabular-nums",
                            statusClass[status]
                          )}
                        >
                          {row.value}
                        </span>
                        <span className="text-muted-foreground text-sm">mg/dL</span>
                        <span className="text-muted-foreground text-sm">
                          {row.type}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                        <p>
                          {new Date(row.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        {row.notes && (
                          <p className="mt-1">{row.notes}</p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
