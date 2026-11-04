import type { Metadata } from "next";
import { Suspense } from "react";
import { ItemDetail } from "@/components/item/item-detail";
import { ItemPageCrumbs } from "@/components/item/item-page-crumbs";
import { ItemSkeleton } from "@/components/skeletons/item-skeleton";
import { getListing } from "@/lib/listings";

export async function generateMetadata({ params }: PageProps<"/items/[id]">): Promise<Metadata> {
  const found = await getListing((await params).id);
  return { title: found ? `${found.listing.name} | GiveAgain` : "Item not found | GiveAgain" };
}

export default function ItemPage({ params }: PageProps<"/items/[id]">) {
  return (
    <main>
      <Suspense fallback={<ItemSkeleton />}>
        <ItemPageCrumbs params={params} />
        <ItemDetail params={params} />
      </Suspense>
    </main>
  );
}
