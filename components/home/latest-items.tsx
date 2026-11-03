import { ItemGrid } from "@/components/shares/item-grid";
import { latestListings } from "@/lib/listings";

/** The newest approved listings. Reads live data, so render inside Suspense. */
export async function LatestItems() {
  return <ItemGrid items={await latestListings(4)} />;
}
