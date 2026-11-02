import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseResults } from "@/components/browse/browse-results";
import { ItemGridFallback } from "@/components/shares/item-grid-fallback";

export const metadata: Metadata = { title: "Browse free things | GiveAgain" };

export default function BrowsePage({ searchParams }: PageProps<"/browse">) {
  return (
    <main>
      <Suspense fallback={<ItemGridFallback />}>
        <BrowseResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
