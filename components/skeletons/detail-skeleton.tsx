import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** A single listing or request page while it loads: breadcrumb, title, text and a block of actions. */
export function DetailSkeleton() {
  return (
    <Region>
      <div className="border-b border-line px-4 py-3 sm:px-8"><Skeleton className="h-4 w-56 max-w-full" /></div>
      <div className="flex max-w-3xl flex-col gap-8 p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-6 w-24" /></div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-44" />
      </div>
    </Region>
  );
}
