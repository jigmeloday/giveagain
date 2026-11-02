import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type BrowseHeaderProps = { title: string; count: number; q?: string };

export function BrowseHeader({ title, count, q }: BrowseHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-line p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(36px,6vw,64px)]">{title}</h1>
        <p className="flex items-center gap-2 text-muted-foreground" aria-live="polite">
          <MapPin aria-hidden className="size-4" />
          {count} free {count === 1 ? "thing" : "things"}
        </p>
      </div>
      <div className="relative w-full sm:max-w-sm">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input form="browse-filters" name="q" type="search" aria-label="Search free things" placeholder="Search sofas, books, rice cookers…" defaultValue={q} className="bg-mist pl-9" />
      </div>
    </div>
  );
}
