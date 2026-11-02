import type { Metadata } from "next";
import { Suspense } from "react";
import { ItemDetail } from "@/components/item/item-detail";
import { ItemPageCrumbs } from "@/components/item/item-page-crumbs";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";
import { getListing } from "@/lib/listings";

export async function generateMetadata({ params }: PageProps<"/items/[id]">): Promise<Metadata> {
  const item = getListing((await params).id);
  return { title: item ? `${item.name} | GiveAgain` : "Item not found | GiveAgain" };
}

export default function ItemPage({ params }: PageProps<"/items/[id]">) {
  return (
    <main>
      <Suspense fallback={<PhotoPlaceholder caption="Loading" className="m-6 h-64 sm:m-10" />}>
        <ItemPageCrumbs params={params} />
        <ItemDetail params={params} />
      </Suspense>
    </main>
  );
}
