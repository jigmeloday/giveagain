import { Skeleton } from "@/components/ui/skeleton";

const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 p-4 sm:grid-cols-3 sm:p-8 xl:grid-cols-4";

/** Card-shaped blocks in the same grid as ItemGrid. No role: put it inside a Region. */
export function ItemGridCells({ count = 8, className = GRID }: { count?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/5]" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
