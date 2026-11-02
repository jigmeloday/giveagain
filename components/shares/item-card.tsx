import Link from "next/link";
import { ItemPhoto } from "@/components/shares/item-photo";
import { askingLabel } from "@/lib/asking";
import { timeAgo } from "@/lib/format";
import type { Listing } from "@/types/listing";

export function ItemCard({ id, name, category, dzongkhag, area, postedAt, status, askingCount, photos }: Listing) {
  return (
    <Link href={`/items/${id}`} className="group flex flex-col gap-3">
      <ItemPhoto
        src={photos?.[0]}
        alt={`${name}, the whole item`}
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="aspect-[4/5]"
      />
      <div className="flex flex-col gap-1">
        <p className="flex items-center justify-between gap-2 text-sm">
          <span className="text-primary-ink">{category}</span>
          <span className="truncate text-muted-foreground">{area}, {dzongkhag}</span>
        </p>
        <h3 className="text-lg leading-tight tracking-[-0.02em] group-hover:underline">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {timeAgo(postedAt)} · {status === "reserved" ? "Reserved" : askingLabel(askingCount)}
        </p>
      </div>
    </Link>
  );
}
