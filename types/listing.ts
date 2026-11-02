import type { CATEGORIES, CONDITIONS } from "@/constants/listing";
import type { DZONGKHAGS } from "@/constants/location";

export type Listing = {
  id: string;
  name: string;
  description: string;
  category: (typeof CATEGORIES)[number];
  condition: (typeof CONDITIONS)[number];
  dzongkhag: (typeof DZONGKHAGS)[number];
  /** Approximate area only, never a precise address. */
  area: string;
  /** ISO time in UTC. */
  postedAt: string;
  status: "available" | "reserved";
};

export type ListingFilters = {
  q?: string;
  category?: string;
  dzongkhag?: string;
  condition?: string;
};
