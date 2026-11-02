import { SAMPLE_LISTINGS } from "@/constants/sample-listings";
import type { Listing, ListingFilters } from "@/types/listing";

/** Public data access. Swap the body for the public tRPC query once the API exists. */
export function filterListings(listings: Listing[], { q, category, dzongkhag, condition }: ListingFilters): Listing[] {
  const query = q?.trim().toLowerCase();
  return listings.filter(
    (item) =>
      (!category || item.category === category) &&
      (!dzongkhag || item.dzongkhag === dzongkhag) &&
      (!condition || item.condition === condition) &&
      (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)),
  );
}

export function searchListings(filters: ListingFilters): Listing[] {
  return filterListings(SAMPLE_LISTINGS, filters);
}

export function latestListings(count: number): Listing[] {
  return SAMPLE_LISTINGS.slice(0, count);
}

export function getListing(id: string): Listing | undefined {
  return SAMPLE_LISTINGS.find((item) => item.id === id);
}
