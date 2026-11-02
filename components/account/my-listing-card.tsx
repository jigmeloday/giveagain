import Link from "next/link";
import { StatusTag } from "@/components/shares/status-tag";
import { buttonVariants } from "@/components/ui/button";
import { LISTING_STATUS_HELP, LISTING_STATUS_LABELS, LISTING_STATUS_TONES } from "@/constants/status";
import { formatDate } from "@/lib/format";
import type { MyListing } from "@/types/account";

export function MyListingCard({ listing }: { listing: MyListing }) {
  const { id, name, area, dzongkhag, postedAt, status, requests } = listing;
  const waiting = requests.filter((r) => r.status === "requested").length;

  return (
    <li className="flex flex-col gap-4 border border-line bg-card p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl tracking-[-0.02em]">{name}</h2>
          <StatusTag label={LISTING_STATUS_LABELS[status]} tone={LISTING_STATUS_TONES[status]} />
        </div>
        <p className="text-sm text-muted-foreground">{area}, {dzongkhag} · Posted {formatDate(postedAt)}</p>
      </div>
      <p>{LISTING_STATUS_HELP[status]}</p>
      <Link
        href={`/account/listings/${id}`}
        className={buttonVariants({ variant: waiting > 0 ? "default" : "outline", className: "w-fit" })}
      >
        {waiting > 0 ? `See who asked (${waiting})` : "View details"}
      </Link>
    </li>
  );
}
