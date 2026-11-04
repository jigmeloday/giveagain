import { Region } from "@/components/skeletons/region";
import { Skeleton } from "@/components/ui/skeleton";

const Field = () => (
  <div className="flex flex-col gap-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-11 w-full" /></div>
);

/** The profile page while it loads: photo, fields and settings rows. */
export function ProfileSkeleton() {
  return (
    <Region className="flex max-w-4xl flex-col gap-12 p-6 sm:p-10">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-5"><Skeleton className="size-24 shrink-0" /><Skeleton className="h-10 w-2/3" /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field /><Field /></div>
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 sm:grid-cols-2"><Field /><Field /></div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-48" />
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    </Region>
  );
}
