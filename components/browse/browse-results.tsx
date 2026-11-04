import { Suspense } from "react";
import { BrowseHeader } from "@/components/browse/browse-header";
import { BrowseSidebar } from "@/components/browse/browse-sidebar";
import { EmptyResults } from "@/components/browse/empty-results";
import { ItemGrid } from "@/components/shares/item-grid";
import { ItemGridSkeleton } from "@/components/skeletons/item-grid-skeleton";
import { getCategoryCounts, searchListings } from "@/lib/listings";
import { parseFilters } from "@/lib/search-params";

/** Reads the URL (search and filters), so render it inside Suspense. */
export async function BrowseResults({ searchParams }: { searchParams: PageProps<"/browse">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  const [items, counts] = await Promise.all([searchListings(filters), getCategoryCounts(filters)]);

  return (
    <>
      <BrowseHeader title={filters.dzongkhag ? `Free in ${filters.dzongkhag}` : "Free across Bhutan"} count={items.length} q={filters.q} />
      <div className="flex flex-col md:flex-row">
        <BrowseSidebar filters={filters} counts={counts} />
        <div className="min-w-0 flex-1">
          {items.length > 0 ? (
            <Suspense fallback={<ItemGridSkeleton count={8} />}>
              <ItemGrid items={items} className="grid grid-cols-2 gap-x-4 gap-y-8 p-4 sm:grid-cols-3 sm:p-8 lg:grid-cols-3 xl:grid-cols-4" />
            </Suspense>
          ) : (
            <EmptyResults />
          )}
        </div>
      </div>
    </>
  );
}
