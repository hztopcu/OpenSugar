"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Fab() {
  return (
    <Link
      href="/add"
      className={cn(
        "fixed bottom-20 right-4 z-40 md:bottom-8 md:right-6",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[hsl(var(--health-blue))] text-white shadow-card",
        "transition-smooth hover:opacity-90 active:scale-95",
        "md:h-16 md:w-16"
      )}
      aria-label="Add new entry"
    >
      <Plus className="h-6 w-6 md:h-7 md:w-7" />
    </Link>
  );
}
