import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingDetail } from "@/components/account/booking-detail";

export const metadata: Metadata = { title: "Your request | GiveAgain" };

export default function BookingDetailPage({ params }: PageProps<"/account/bookings/[id]">) {
  return (
    <Suspense fallback={<p role="status" className="p-6 text-muted-foreground sm:p-10">Loading…</p>}>
      <BookingDetail params={params} />
    </Suspense>
  );
}
