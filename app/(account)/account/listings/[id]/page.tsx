import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailSkeleton } from "@/components/skeletons/detail-skeleton";
import { ListingDetail } from "@/components/account/listing-detail";

export const metadata: Metadata = { title: "Your listing | GiveAgain" };

export default function ListingDetailPage({ params }: PageProps<"/account/listings/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ListingDetail params={params} />
    </Suspense>
  );
}
