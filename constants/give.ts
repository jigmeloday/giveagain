import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { toOptions } from "@/lib/options";

export const CATEGORY_OPTIONS = toOptions(CATEGORIES);
export const CONDITION_OPTIONS = [
  { value: "Like new", label: "Like new", hint: "Hardly used, no marks." },
  { value: "Good", label: "Good", hint: "Works well, small signs of use." },
  { value: "Fair", label: "Fair", hint: "Usable, needs some care." },
] satisfies { value: (typeof CONDITIONS)[number]; label: string; hint: string }[];
export const DZONGKHAG_OPTIONS = toOptions(DZONGKHAGS);

export type GiveStepKey = "photos" | "details" | "pickup" | "review";

export const GIVE_STEPS = [
  { key: "photos", label: "Photos", next: "Continue to details", fields: ["photos"] },
  { key: "details", label: "Details", next: "Continue to pickup", fields: ["title", "category", "condition", "description", "size"] },
  { key: "pickup", label: "Pickup", next: "Continue to review", fields: ["dzongkhag", "area", "collection", "headsUp", "phone"] },
  { key: "review", label: "Review", next: "Post it for free", fields: ["agree"] },
] as const;

export const GOOD_LISTING_TIPS = [
  "Photograph any wear honestly",
  "Mention if it needs two people to carry",
  "Add measurements for big things",
] as const;
