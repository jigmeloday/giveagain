import { ItemGridCells } from "@/components/skeletons/item-grid-cells";
import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** The Browse page while it loads: heading and search, filter sidebar, and a grid of cards. */
export function BrowseSkeleton() {
  return (
    <Region>
      <div className="flex flex-col gap-5 border-b border-line p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-11 w-full sm:max-w-sm" />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col gap-4 border-b border-line p-4 sm:p-8 md:w-80 md:shrink-0 md:border-r md:border-b-0">
          <Skeleton className="h-11 w-full" />
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-5 w-full" />)}
        </div>
        <div className="min-w-0 flex-1">
          <ItemGridCells count={8} className="grid grid-cols-2 gap-x-4 gap-y-8 p-4 sm:grid-cols-3 sm:p-8 xl:grid-cols-4" />
        </div>
      </div>
    </Region>
  );
}
