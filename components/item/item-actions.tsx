import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AskForm } from "@/components/item/ask-form";
import { buttonVariants } from "@/components/ui/button";
import { giverFirstName } from "@/lib/giver";
import type { ViewerState } from "@/server/queries/listing-public";

type ItemActionsProps = { id: string; giverName: string; reserved: boolean; viewer: ViewerState };

export function ItemActions({ id, giverName, reserved, viewer }: ItemActionsProps) {
  const first = giverFirstName(giverName);

  if (viewer.isOwner) {
    return (
      <div className="flex flex-col gap-3 bg-mist p-4">
        <p className="font-bold">This is your listing.</p>
        <Link href={`/account/listings/${id}`} className="w-fit font-bold text-primary-ink hover:underline">See who asked</Link>
      </div>
    );
  }

  if (viewer.requested) {
    return (
      <div className="flex flex-col gap-3 bg-mist p-4">
        <p className="font-bold">You asked for this. {first} will call you if they choose you.</p>
        <Link href="/account/bookings" className="w-fit font-bold text-primary-ink hover:underline">See your requests</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reserved && <p className="bg-mist p-4 text-sm">Someone is already collecting this. You can still ask in case it falls through.</p>}
      {viewer.signedIn ? (
        <AskForm listingId={id} giverFirstName={first} />
      ) : (
        <Link href={`/sign-in?next=/items/${id}`} className={buttonVariants({ size: "lg", className: "h-14 justify-between px-5 text-base" })}>
          Sign in to ask {first} for this
          <ArrowRight aria-hidden />
        </Link>
      )}
      <p className="text-sm text-muted-foreground">
        {first} chooses who it goes to, so there&rsquo;s no queue to win. A line about why it would help goes a long way.
      </p>
    </div>
  );
}
