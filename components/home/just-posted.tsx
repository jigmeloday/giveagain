import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ItemGridFallback } from "@/components/shares/item-grid-fallback";
import { ItemGrid } from "@/components/shares/item-grid";
import { latestListings } from "@/lib/listings";

export function JustPosted() {
  return (
    <section aria-labelledby="just-posted-heading" className="border-b border-line">
      <div className="flex items-end justify-between gap-4 border-b border-line p-6 sm:p-10">
        <h2 id="just-posted-heading" className="text-3xl font-extrabold tracking-[-0.04em]">Just posted</h2>
        <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-bold text-primary-ink hover:underline">
          See all <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <Suspense fallback={<ItemGridFallback />}>
        <ItemGrid items={latestListings(4)} />
      </Suspense>
    </section>
  );
}
