import Link from "next/link";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";
import { timeAgo } from "@/lib/format";
import type { Listing } from "@/types/listing";

export function ItemCard({ id, name, category, dzongkhag, area, condition, postedAt, status }: Listing) {
  return (
    <Link href={`/items/${id}`} className="group flex flex-col border-b border-line sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
      <PhotoPlaceholder caption={name} className="aspect-square" />
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
          <span className="text-primary-ink">{category}</span>
          <span className="truncate text-muted-foreground">{area}, {dzongkhag}</span>
        </div>
        <h3 className="text-[15px] font-bold group-hover:underline">{name}</h3>
        <p className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{condition} · {timeAgo(postedAt)}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground">
            {status === "reserved" ? "Free · Reserved" : "Free"}
          </span>
        </p>
      </div>
    </Link>
  );
}
