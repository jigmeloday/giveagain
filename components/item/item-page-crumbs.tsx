import { Breadcrumb } from "@/components/item/breadcrumb";
import { getListing } from "@/lib/listings";

/** Reads the URL (`[id]`), so render it inside Suspense. */
export async function ItemPageCrumbs({ params }: { params: PageProps<"/items/[id]">["params"] }) {
  const found = await getListing((await params).id);
  if (!found) return null;
  const { listing } = found;

  return (
    <Breadcrumb
      crumbs={[
        { label: "Browse", href: "/browse" },
        { label: listing.category, href: `/browse?category=${listing.category}` },
        { label: listing.name },
      ]}
    />
  );
}
