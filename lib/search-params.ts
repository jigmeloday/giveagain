import type { ListingFilters } from "@/types/listing";

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || undefined;

export function parseFilters(params: RawParams): ListingFilters {
  return {
    q: first(params.q)?.slice(0, 100),
    category: first(params.category),
    dzongkhag: first(params.dzongkhag),
    condition: first(params.condition),
  };
}
