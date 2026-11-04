import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

/** The sign-in and sign-up forms while they load. */
export function AuthSkeleton() {
  return (
    <Region className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-3"><Skeleton className="h-12 w-3/4" /><Skeleton className="h-5 w-full" /></div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full" /></div>
        ))}
        <Skeleton className="h-14 w-full" />
      </div>
    </Region>
  );
}
