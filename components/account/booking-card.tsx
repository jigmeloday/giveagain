import Link from "next/link";
import { StatusTag } from "@/components/shares/status-tag";
import { buttonVariants } from "@/components/ui/button";
import { BOOKING_STATUS_HELP, BOOKING_STATUS_LABELS, BOOKING_STATUS_TONES } from "@/constants/status";
import { formatDate } from "@/lib/format";
import type { MyBooking } from "@/types/account";

export function BookingCard({ booking }: { booking: MyBooking }) {
  const { id, itemName, area, dzongkhag, status, requestedAt } = booking;

  return (
    <li className="flex flex-col gap-4 border border-line bg-card p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl tracking-[-0.02em]">{itemName}</h2>
          <StatusTag label={BOOKING_STATUS_LABELS[status]} tone={BOOKING_STATUS_TONES[status]} />
        </div>
        <p className="text-sm text-muted-foreground">{area}, {dzongkhag} · You asked on {formatDate(requestedAt)}</p>
      </div>
      <p>{BOOKING_STATUS_HELP[status]}</p>
      <Link
        href={`/account/bookings/${id}`}
        className={buttonVariants({ variant: status === "accepted" ? "default" : "outline", className: "w-fit" })}
      >
        {status === "accepted" ? "See pickup details" : "View details"}
      </Link>
    </li>
  );
}
