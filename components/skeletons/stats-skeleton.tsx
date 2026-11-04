import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** The admin dashboard while it loads. */
export function StatsSkeleton() {
  return (
    <Region>
      <div className="border-b border-line p-6 sm:p-10"><Skeleton className="h-10 w-48" /></div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-8 xl:grid-cols-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex flex-col gap-3 border border-line bg-card p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </Region>
  );
}
