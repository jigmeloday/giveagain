"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  label: string;
  question: string;
  yesLabel?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  pending?: boolean;
  onConfirm: () => void;
};

/** Asks "Are you sure?" before doing something that can't be undone. */
export function ConfirmButton({ label, question, yesLabel = "Yes", variant, size = "lg", pending, onConfirm }: ConfirmButtonProps) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button type="button" size={size} variant={variant} disabled={pending} onClick={() => setAsking(true)}>
        {pending ? "Please wait…" : label}
      </Button>
    );
  }

  return (
    <div role="group" aria-label={question} className="flex w-full flex-col gap-3 border border-foreground p-4">
      <p className="text-lg font-bold">{question}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" onClick={() => { setAsking(false); onConfirm(); }}>{yesLabel}</Button>
        <Button type="button" size="lg" variant="outline" onClick={() => setAsking(false)}>No, go back</Button>
      </div>
    </div>
  );
}
