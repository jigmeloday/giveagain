import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/item/breadcrumb";
import { ListingActions } from "@/components/account/listing-actions";
import { ListingRequests } from "@/components/account/listing-requests";
import { StatusTag } from "@/components/shares/status-tag";
import { LISTING_STATUS_HELP, LISTING_STATUS_LABELS, LISTING_STATUS_TONES } from "@/constants/status";
import { getMyListing } from "@/lib/account";
import { formatDate } from "@/lib/format";

const OPEN = ["pending", "available", "reserved"];

/** Reads the URL (`[id]`), so render it inside Suspense. */
export async function ListingDetail({ params }: { params: PageProps<"/account/listings/[id]">["params"] }) {
  const listing = await getMyListing((await params).id);
  if (!listing) notFound();
  const { id, name, area, dzongkhag, postedAt, status, rejectionReason, requests } = listing;
  const online = status === "available" || status === "reserved";

  return (
    <>
      <Breadcrumb crumbs={[{ label: "I'm giving", href: "/account/listings" }, { label: name }]} />
      <div className="flex max-w-3xl flex-col gap-8 p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[clamp(32px,4vw,48px)]">{name}</h1>
            <StatusTag label={LISTING_STATUS_LABELS[status]} tone={LISTING_STATUS_TONES[status]} />
          </div>
          <p className="text-muted-foreground">{area}, {dzongkhag} · Posted {formatDate(postedAt)}</p>
          <p className="max-w-prose text-lg">{LISTING_STATUS_HELP[status]}</p>
          {rejectionReason && <p role="note" className="border border-destructive p-3 text-destructive">{rejectionReason}</p>}
          {online && <Link href={`/items/${id}`} className="w-fit font-bold text-primary-ink hover:underline">See how it looks to others</Link>}
        </div>
        {(requests.length > 0 || online) && <ListingRequests name={name} requests={requests} />}
        {OPEN.includes(status) && <ListingActions id={id} status={status} />}
      </div>
    </>
  );
}
