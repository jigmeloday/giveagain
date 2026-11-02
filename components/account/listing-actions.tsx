"use client";

import { ConfirmButton } from "@/components/shares/confirm-button";
import { useAction } from "@/hooks/use-action";
import { accountActions } from "@/lib/account-actions";
import type { ListingStatus } from "@/types/account";

export function ListingActions({ id, status }: { id: string; status: ListingStatus }) {
  const given = useAction(accountActions.markGiven);
  const withdraw = useAction(accountActions.withdrawListing);

  if (given.done) return <p role="status" className="font-bold text-primary-ink">Marked as given. Thank you!</p>;
  if (withdraw.done) return <p role="status" className="font-bold">This post is taken down.</p>;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
      {(status === "available" || status === "reserved") && (
        <ConfirmButton
          size="default"
          label="I gave it away"
          question="Has this been given to someone?"
          yesLabel="Yes, it's given"
          variant="outline"
          pending={given.pending}
          onConfirm={() => given.run(id)}
        />
      )}
      <ConfirmButton
        size="default"
        label="Take this down"
        question="Take this post down? People will no longer see it."
        yesLabel="Yes, take it down"
        variant="link"
        pending={withdraw.pending}
        onConfirm={() => withdraw.run(id)}
      />
      {(given.error || withdraw.error) && <p role="alert" className="w-full text-destructive">{given.error ?? withdraw.error}</p>}
    </div>
  );
}
