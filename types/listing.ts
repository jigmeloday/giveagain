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
  /** Photo URLs, whole item first. At least 3 once real listings exist. */
  photos?: string[];
  /** How many people have asked for it. */
  askingCount: number;
  size?: string;
  /** When it can be collected, e.g. "Weekday evenings". */
  collection?: string;
  /** Anything to know before coming, e.g. "Needs two people to carry". */
  headsUp?: string;
  /** First name and initial only. */
  giver: { name: string; given: number; since: string };
};

export type ListingFilters = {
  q?: string;
  category?: Listing["category"];
  dzongkhag?: Listing["dzongkhag"];
  condition?: Listing["condition"];
};

export type ItemPhoto = {
  /** Missing until the photo loads or exists: a placeholder is shown instead. */
  src?: string;
  alt: string;
};
