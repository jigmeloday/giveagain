import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { LatestItems } from "@/components/home/latest-items";
import { ItemGridSkeleton } from "@/components/skeletons/item-grid-skeleton";

export function JustPosted() {
  return (
    <section aria-labelledby="just-posted-heading" className="border-b border-line">
      <div className="flex items-end justify-between gap-4 px-6 py-8 sm:px-10">
        <h2 id="just-posted-heading" className="text-3xl sm:text-4xl">Just posted</h2>
        <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-bold text-primary-ink hover:underline">
          See all <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <div className="border-t border-line">
        <Suspense fallback={<ItemGridSkeleton />}>
          <LatestItems />
        </Suspense>
      </div>
    </section>
  );
}
