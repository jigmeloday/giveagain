import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import type { ListingFilters } from "@/types/listing";
import { FilterSelect } from "./filter-select";

export function BrowseFilters({ filters, active }: { filters: ListingFilters; active: boolean }) {
  return (
    <form role="search" action="/browse" className="grid gap-3 border-b border-line p-4 sm:p-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
      <label className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Search</span>
        <Input name="q" type="search" placeholder="Sofa, books, rice cooker" defaultValue={filters.q} className="border-foreground" />
      </label>
      <FilterSelect name="category" label="Category" allLabel="All categories" options={CATEGORIES} defaultValue={filters.category} />
      <FilterSelect name="dzongkhag" label="Dzongkhag" allLabel="All of Bhutan" options={DZONGKHAGS} defaultValue={filters.dzongkhag} />
      <FilterSelect name="condition" label="Condition" allLabel="Any condition" options={CONDITIONS} defaultValue={filters.condition} />
      <div className="flex items-center gap-4 md:col-span-2 lg:col-span-1">
        <Button type="submit" size="lg">
          <Search aria-hidden />
          Search
        </Button>
        {active && <Link href="/browse" className="text-sm font-bold text-primary-ink hover:underline">Clear</Link>}
      </div>
    </form>
  );
}
