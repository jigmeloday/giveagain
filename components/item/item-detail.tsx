import { notFound } from "next/navigation";
import { ItemGallery } from "@/components/item/item-gallery";
import { ItemSummary } from "@/components/item/item-summary";
import { itemPhotos } from "@/lib/item-photos";
import { getListing } from "@/lib/listings";

/** Reads the URL (`[id]`), so render it inside Suspense. */
export async function ItemDetail({ params }: { params: PageProps<"/items/[id]">["params"] }) {
  const item = getListing((await params).id);
  if (!item) notFound();

  return (
    <div className="grid md:grid-cols-[1.25fr_1fr]">
      <div className="md:border-r md:border-line">
        <ItemGallery photos={itemPhotos(item)} />
      </div>
      <ItemSummary item={item} />
    </div>
  );
}
