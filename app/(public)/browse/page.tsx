import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseFilters } from "@/components/browse/browse-filters";
import { EmptyResults } from "@/components/browse/empty-results";
import { ItemGridFallback } from "@/components/shares/item-grid-fallback";
import { ItemGrid } from "@/components/shares/item-grid";
import { searchListings } from "@/lib/listings";
import { parseFilters } from "@/lib/search-params";

export const metadata: Metadata = { title: "Browse free things | GiveAgain" };

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const filters = parseFilters(await searchParams);
  const items = searchListings(filters);
  const active = Object.values(filters).some(Boolean);

  return (
    <main>
      <div className="border-b border-line p-6 sm:p-10">
        <h1 className="text-[clamp(36px,6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.04em]">What&rsquo;s free nearby</h1>
      </div>
      <BrowseFilters filters={filters} active={active} />
      <p className="border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:px-10" aria-live="polite">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>
      {items.length > 0 ? (
        <Suspense fallback={<ItemGridFallback />}>
          <ItemGrid items={items} />
        </Suspense>
      ) : (
        <EmptyResults />
      )}
    </main>
  );
}
