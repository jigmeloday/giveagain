"use client";

import { Check, X } from "lucide-react";
import { RejectForm } from "@/components/admin/reject-form";
import { Button } from "@/components/ui/button";
import { useModerateListing } from "@/hooks/use-moderate-listing";

export function ModerationActions({ id, onReviewed }: { id: string; onReviewed: () => void }) {
  const { rejecting, setRejecting, reason, setReason, note, setNote, approve, reject } = useModerateListing(id, onReviewed);

  if (rejecting) {
    return (
      <RejectForm
        reason={reason}
        note={note}
        pending={reject.pending}
        error={reject.error}
        onReason={setReason}
        onNote={setNote}
        onSubmit={() => reject.run()}
        onCancel={() => setRejecting(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={approve.pending} onClick={() => approve.run()}>
          <Check aria-hidden />
          {approve.pending ? "Please wait…" : "Approve"}
        </Button>
        <Button type="button" variant="outline" disabled={approve.pending} onClick={() => setRejecting(true)}>
          <X aria-hidden />
          Reject
        </Button>
      </div>
      {approve.error && <p role="alert" className="font-bold text-destructive">{approve.error}</p>}
    </div>
  );
}
