import { TRPCError } from "@trpc/server";
import { publicApi } from "@/server/public-api";
import { serverCaller } from "@/server/caller";
import type { Listing, ListingFilters } from "@/types/listing";

const PAGE_SIZE = 48;

/** Public listing data for pages. Reads from the API; only approved listings ever come back. */
export async function searchListings(filters: ListingFilters): Promise<Listing[]> {
  return (await (await publicApi()).listing.list({ ...filters, limit: PAGE_SIZE })).items;
}

export async function latestListings(count: number): Promise<Listing[]> {
  return (await (await publicApi()).listing.list({ limit: count })).items;
}

export async function getCategoryCounts(filters: ListingFilters) {
  return (await publicApi()).listing.categoryCounts(filters);
}

/** One public item plus what the signed-in visitor can do with it, or null when it isn't public. */
export async function getListing(id: string) {
  try {
    return await (await serverCaller()).listing.byId({ id });
  } catch (error) {
    if (error instanceof TRPCError && (error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")) return null;
    throw error;
  }
}
