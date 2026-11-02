import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { toOptions } from "@/lib/options";

export const CATEGORY_OPTIONS = toOptions(CATEGORIES);
export const CONDITION_OPTIONS = [
  { value: "Like new", label: "Like new", hint: "Hardly used, no marks." },
  { value: "Good", label: "Good", hint: "Works well, small signs of use." },
  { value: "Fair", label: "Fair", hint: "Works, with visible wear." },
] satisfies { value: (typeof CONDITIONS)[number]; label: string; hint: string }[];
export const DZONGKHAG_OPTIONS = toOptions(DZONGKHAGS);
