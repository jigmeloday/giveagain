"use client";

import { Select } from "@/components/shares/select";
import { Textarea } from "@/components/shares/textarea";
import { Button } from "@/components/ui/button";
import { REJECTION_REASONS, type RejectionReason } from "@/constants/moderation";

type RejectFormProps = {
  reason: RejectionReason | "";
  note: string;
  pending: boolean;
  error?: string;
  onReason: (reason: RejectionReason) => void;
  onNote: (note: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function RejectForm({ reason, note, pending, error, onReason, onNote, onSubmit, onCancel }: RejectFormProps) {
  return (
    <div className="flex flex-col gap-4 border border-foreground p-4">
      <Select
        label="Why can't we list it?"
        hint="The owner sees this reason, in kind words."
        required
        options={REJECTION_REASONS}
        value={reason}
        onValueChange={(value) => onReason(value as RejectionReason)}
      />
      <Textarea label="Note for the owner (optional)" maxLength={300} rows={3} value={note} onChange={(e) => onNote(e.target.value)} />
      {error && <p role="alert" className="font-bold text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="destructive" disabled={pending} onClick={onSubmit}>{pending ? "Please wait…" : "Reject listing"}</Button>
        <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
