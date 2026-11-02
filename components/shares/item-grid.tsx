import { connection } from "next/server";
import { ItemCard } from "@/components/shares/item-card";
import type { Listing } from "@/types/listing";

/** Reads the clock for relative times, so it renders at request time. Wrap in Suspense. */
export async function ItemGrid({ items, className }: { items: Listing[]; className?: string }) {
  await connection();
  return (
    <div className={className ?? "grid grid-cols-2 gap-x-4 gap-y-8 p-4 sm:grid-cols-3 sm:p-8 xl:grid-cols-4"}>
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
}
