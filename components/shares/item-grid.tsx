import { connection } from "next/server";
import { ItemCard } from "@/components/shares/item-card";
import type { Listing } from "@/types/listing";

/** Reads the clock for relative times, so it renders at request time. Wrap in Suspense. */
export async function ItemGrid({ items }: { items: Listing[] }) {
  await connection();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
}
