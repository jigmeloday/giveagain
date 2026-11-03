import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import type { ListingFilters } from "@/types/listing";

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || undefined;
const oneOf = <T extends string>(allowed: readonly T[], value?: string): T | undefined => allowed.find((item) => item === value);

/** Reads filters from the URL. Anything that isn't a known choice is ignored, so a typed-in URL can't break the page. */
export function parseFilters(params: RawParams): ListingFilters {
  return {
    q: first(params.q)?.trim().slice(0, 100) || undefined,
    category: oneOf(CATEGORIES, first(params.category)),
    dzongkhag: oneOf(DZONGKHAGS, first(params.dzongkhag)),
    condition: oneOf(CONDITIONS, first(params.condition)),
  };
}
