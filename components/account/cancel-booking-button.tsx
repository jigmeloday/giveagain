"use client";

import { ConfirmButton } from "@/components/shares/confirm-button";
import { useAction } from "@/hooks/use-action";
import { accountActions } from "@/lib/account-actions";

export function CancelBookingButton({ id }: { id: string }) {
  const { run, pending, done, error } = useAction(accountActions.cancelBooking);

  if (done) return <p role="status" className="text-lg font-bold">Request cancelled.</p>;

  return (
    <div className="flex flex-col items-start gap-2">
      <ConfirmButton
        size="default"
        label="Cancel my request"
        question="Cancel your request?"
        yesLabel="Yes, cancel it"
        variant="outline"
        pending={pending}
        onConfirm={() => run(id)}
      />
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </div>
  );
}
