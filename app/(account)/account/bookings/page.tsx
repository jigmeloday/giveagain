import type { Metadata } from "next";
import Link from "next/link";
import { BookingCard } from "@/components/account/booking-card";
import { PageIntro } from "@/components/account/page-intro";
import { EmptyState } from "@/components/shares/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getMyBookings } from "@/lib/account";

export const metadata: Metadata = { title: "Things I asked for | GiveAgain" };

export default async function MyBookingsPage() {
  const bookings = await getMyBookings();

  return (
    <>
      <PageIntro title="Things I asked for" body="Everything you have asked for, and what the giver said." />
      {bookings.length === 0 ? (
        <EmptyState title="You haven't asked for anything yet." body="Find something you need and ask for it. It's free.">
          <Link href="/browse" className={buttonVariants({ size: "lg" })}>See what&rsquo;s free</Link>
        </EmptyState>
      ) : (
        <ul className="grid items-start gap-4 p-4 sm:p-8 lg:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </>
  );
}
