import { MAX_LISTING_PHOTOS, MIN_LISTING_PHOTOS } from "@/constants/images";
import type { ItemPhoto, Listing } from "@/types/listing";

const FALLBACK_ALTS = ["the whole item", "a close-up", "another angle"];

/** Between 3 and 6 photos for the detail page: real ones first, placeholders to reach the minimum. */
export function itemPhotos({ name, photos = [] }: Pick<Listing, "name" | "photos">): ItemPhoto[] {
  const count = Math.min(Math.max(photos.length, MIN_LISTING_PHOTOS), MAX_LISTING_PHOTOS);
  return Array.from({ length: count }, (_, i) => ({
    src: photos[i],
    alt: `${name}, ${FALLBACK_ALTS[i] ?? `photo ${i + 1}`}`,
  }));
}
