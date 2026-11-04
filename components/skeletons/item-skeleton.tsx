import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** The item page while it loads: breadcrumb, photos, and the details column. */
export function ItemSkeleton() {
  return (
    <Region>
      <div className="border-b border-line px-4 py-3 sm:px-8"><Skeleton className="h-4 w-64 max-w-full" /></div>
      <div className="grid md:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-3 p-4 sm:p-8 md:border-r md:border-line">
          <Skeleton className="aspect-[4/3]" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-[4/3]" />)}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div className="flex gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-28" /></div>
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </Region>
  );
}
