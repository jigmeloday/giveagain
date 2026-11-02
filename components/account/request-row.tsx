"use client";

import { useState } from "react";
import { CallButton } from "@/components/account/call-button";
import { ConfirmButton } from "@/components/shares/confirm-button";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { accountActions } from "@/lib/account-actions";
import { formatDate } from "@/lib/format";
import type { BookingRequest } from "@/types/account";

export function RequestRow({ request }: { request: BookingRequest }) {
  const [status, setStatus] = useState(request.status);
  const answer = useAction(async (value: "accepted" | "declined") => {
    await accountActions.answerRequest(request.id, value);
    setStatus(value);
  });

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-lg font-bold">{request.name}</p>
        <p className="text-sm text-muted-foreground">Asked on {formatDate(request.requestedAt)}</p>
      </div>
      {request.note && <p className="max-w-prose text-muted-foreground">&ldquo;{request.note}&rdquo;</p>}
      {status === "requested" && (
        <div className="flex flex-wrap gap-2">
          <ConfirmButton
            size="default"
            label="Give it to them"
            question={`Give it to ${request.name}?`}
            pending={answer.pending}
            onConfirm={() => answer.run("accepted")}
          />
          <Button type="button" variant="outline" disabled={answer.pending} onClick={() => answer.run("declined")}>No thanks</Button>
        </div>
      )}
      {status === "accepted" && (
        <>
          <p className="font-bold text-primary-ink">You chose {request.name.split(" ")[0]}.</p>
          <CallButton name={request.name.split(" ")[0]} phone={request.phone} />
        </>
      )}
      {status === "declined" && <p className="text-muted-foreground">You said no thanks.</p>}
      {answer.error && <p role="alert" className="text-destructive">{answer.error}</p>}
    </li>
  );
}
