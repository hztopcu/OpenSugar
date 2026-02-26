import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <header className="rounded-b-[28px] bg-gradient-to-br from-muted to-muted/80 px-5 pb-8 pt-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-2 space-y-4">
        <Card className="overflow-hidden rounded-[22px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[22px]">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-24 rounded-2xl" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden rounded-[22px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[220px] w-full rounded-2xl" />
            </CardContent>
          </Card>
          <Card className="overflow-hidden rounded-[22px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[220px] w-full rounded-2xl" />
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-[22px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-2xl" />
              <Skeleton className="h-14 w-20 rounded-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[22px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
