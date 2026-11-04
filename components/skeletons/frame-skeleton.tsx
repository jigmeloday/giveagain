import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** The side menu and a content area while a signed-in area checks who you are. */
export function FrameSkeleton() {
  return (
    <Region className="grid md:grid-cols-[17rem_1fr]">
      <div className="flex flex-col gap-4 border-b-2 border-line p-4 sm:p-8 md:border-r-2 md:border-b-0">
        <Skeleton className="h-9 w-40" />
        <div className="flex gap-2 md:flex-col">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-11 w-28 md:w-full" />)}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-10">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Region>
  );
}
