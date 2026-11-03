import { useState } from "react";
import type { RejectionReason } from "@/constants/moderation";
import { useAction } from "@/hooks/use-action";
import { friendlyError, trpc } from "@/lib/trpc-client";

/** Approve or reject one listing. `onReviewed` runs after the server accepted it. */
export function useModerateListing(id: string, onReviewed: () => void) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState<RejectionReason | "">("");
  const [note, setNote] = useState("");

  const approve = useAction(async () => {
    await trpc.admin.moderation.approve.mutate({ id }).catch((e) => { throw friendlyError(e); });
    onReviewed();
  });
  const reject = useAction(async () => {
    if (!reason) throw new Error("Choose a reason so the owner knows what to fix.");
    await trpc.admin.moderation.reject.mutate({ id, reason, note: note || undefined }).catch((e) => { throw friendlyError(e); });
    onReviewed();
  });

  return { rejecting, setRejecting, reason, setReason, note, setNote, approve, reject };
}
