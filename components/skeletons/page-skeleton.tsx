import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** A simple heading and paragraphs, for pages that have no more specific skeleton. */
export function PageSkeleton() {
  return (
    <Region className="flex flex-col gap-4 p-6 sm:p-10">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-4 h-40 w-full" />
    </Region>
  );
}
