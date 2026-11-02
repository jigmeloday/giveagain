import Link from "next/link";
import { notFound } from "next/navigation";
import { CallButton } from "@/components/account/call-button";
import { CancelBookingButton } from "@/components/account/cancel-booking-button";
import { Breadcrumb } from "@/components/item/breadcrumb";
import { StatusTag } from "@/components/shares/status-tag";
import { BOOKING_STATUS_HELP, BOOKING_STATUS_LABELS, BOOKING_STATUS_TONES } from "@/constants/status";
import { getMyBooking } from "@/lib/account";
import { formatDate } from "@/lib/format";

/** Reads the URL (`[id]`), so render it inside Suspense. */
export async function BookingDetail({ params }: { params: PageProps<"/account/bookings/[id]">["params"] }) {
  const booking = await getMyBooking((await params).id);
  if (!booking) notFound();
  const { id, itemId, itemName, area, dzongkhag, status, requestedAt, giverPhone, pickupNote } = booking;

  return (
    <>
      <Breadcrumb crumbs={[{ label: "I asked for", href: "/account/bookings" }, { label: itemName }]} />
      <div className="flex max-w-3xl flex-col gap-8 p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[clamp(32px,4vw,48px)]">{itemName}</h1>
            <StatusTag label={BOOKING_STATUS_LABELS[status]} tone={BOOKING_STATUS_TONES[status]} />
          </div>
          <p className="text-muted-foreground">{area}, {dzongkhag} · You asked on {formatDate(requestedAt)}</p>
          <p className="max-w-prose text-lg">{BOOKING_STATUS_HELP[status]}</p>
          <Link href={`/items/${itemId}`} className="w-fit font-bold text-primary-ink hover:underline">See the item</Link>
        </div>
        {status === "accepted" && (
          <section aria-label="Pickup details" className="flex flex-col gap-4">
            <h2 className="border-b-2 border-line pb-3 text-2xl tracking-[-0.03em]">Pickup details</h2>
            {pickupNote && <p className="text-lg"><span className="font-bold">Where to collect:</span> {pickupNote}</p>}
            {giverPhone && <CallButton name="the giver" phone={giverPhone} />}
          </section>
        )}
        {status === "requested" && <CancelBookingButton id={id} />}
      </div>
    </>
  );
}
