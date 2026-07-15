import { Skeleton } from "@heroui/react";

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-[var(--row-padding-y)] sm:gap-4 sm:px-4">
      <Skeleton className="size-4 rounded" />
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
      <Skeleton className="hidden h-5 w-10 shrink-0 rounded-full sm:block" />
    </div>
  );
}
