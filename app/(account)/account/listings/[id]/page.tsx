import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingDetail } from "@/components/account/listing-detail";

export const metadata: Metadata = { title: "Your listing | GiveAgain" };

export default function ListingDetailPage({ params }: PageProps<"/account/listings/[id]">) {
  return (
    <Suspense fallback={<p role="status" className="p-6 text-muted-foreground sm:p-10">Loading…</p>}>
      <ListingDetail params={params} />
    </Suspense>
  );
}
