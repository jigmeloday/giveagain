import { ChoiceRow } from "@/components/browse/choice-row";
import { FilterForm } from "@/components/browse/filter-form";
import { FilterGroup } from "@/components/browse/filter-group";
import { FilterSelect } from "@/components/browse/filter-select";
import { SidebarHelp } from "@/components/browse/sidebar-help";
import { CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { countByCategory } from "@/lib/listings";
import type { ListingFilters } from "@/types/listing";

export function BrowseSidebar({ filters }: { filters: ListingFilters }) {
  const { all, byCategory } = countByCategory(filters);

  return (
    <aside aria-label="Filters" className="border-b border-line md:w-80 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex flex-col gap-8 p-4 sm:p-8 md:sticky md:top-0 md:max-h-dvh md:overflow-y-auto">
        <FilterForm>
          <FilterSelect name="dzongkhag" label="Where" allLabel="All of Bhutan" options={DZONGKHAGS} defaultValue={filters.dzongkhag} />
          <FilterGroup legend="Category">
            <ChoiceRow name="category" value="" label="All" count={all} checked={!filters.category} />
            {byCategory.map(({ category, count }) => (
              <ChoiceRow key={category} name="category" value={category} label={category} count={count} checked={filters.category === category} />
            ))}
          </FilterGroup>
          <FilterGroup legend="Condition">
            <ChoiceRow name="condition" value="" label="Any condition" checked={!filters.condition} />
            {CONDITIONS.map((condition) => (
              <ChoiceRow key={condition} name="condition" value={condition} label={condition} checked={filters.condition === condition} />
            ))}
          </FilterGroup>
          <noscript><button type="submit">Show results</button></noscript>
        </FilterForm>
        <SidebarHelp />
      </div>
    </aside>
  );
}
