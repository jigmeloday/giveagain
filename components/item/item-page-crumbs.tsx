import { Breadcrumb } from "@/components/item/breadcrumb";
import { getListing } from "@/lib/listings";

/** Reads the URL (`[id]`), so render it inside Suspense. */
export async function ItemPageCrumbs({ params }: { params: PageProps<"/items/[id]">["params"] }) {
  const item = getListing((await params).id);
  if (!item) return null;

  return (
    <Breadcrumb
      crumbs={[
        { label: "Browse", href: "/browse" },
        { label: item.category, href: `/browse?category=${item.category}` },
        { label: item.name },
      ]}
    />
  );
}
