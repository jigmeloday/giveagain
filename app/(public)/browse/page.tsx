import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseResults } from "@/components/browse/browse-results";
import { BrowseSkeleton } from "@/components/skeletons/browse-skeleton";

export const metadata: Metadata = { title: "Browse free things | GiveAgain" };

export default function BrowsePage({ searchParams }: PageProps<"/browse">) {
  return (
    <main>
      <Suspense fallback={<BrowseSkeleton />}>
        <BrowseResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
