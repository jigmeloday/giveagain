import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailSkeleton } from "@/components/skeletons/detail-skeleton";
import { BookingDetail } from "@/components/account/booking-detail";

export const metadata: Metadata = { title: "Your request | GiveAgain" };

export default function BookingDetailPage({ params }: PageProps<"/account/bookings/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <BookingDetail params={params} />
    </Suspense>
  );
}
