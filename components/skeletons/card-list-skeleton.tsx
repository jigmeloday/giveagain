import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** A heading and a grid of cards, for "I'm giving", "I asked for" and the moderation queue. */
export function CardListSkeleton({ count = 4, withIntro = true }: { count?: number; withIntro?: boolean }) {
  return (
    <Region>
      {withIntro && (
        <div className="flex flex-col gap-3 border-b border-line p-6 sm:px-10">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}
      <div className="grid items-start gap-4 p-4 sm:p-8 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex flex-col gap-4 border border-line bg-card p-5">
            <div className="flex items-start justify-between gap-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-6 w-20" /></div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-11 w-36" />
          </div>
        ))}
      </div>
    </Region>
  );
}
