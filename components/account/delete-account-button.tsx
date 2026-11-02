"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/shares/confirm-button";
import { useAction } from "@/hooks/use-action";
import { accountActions } from "@/lib/account-actions";

export function DeleteAccountButton() {
  const router = useRouter();
  const { run, pending, error } = useAction(async () => {
    await accountActions.deleteAccount();
    router.push("/");
  });

  return (
    <div className="flex flex-col items-end gap-2">
      <ConfirmButton
        size="default"
        variant="link"
        label="Delete my account"
        question="Delete your account? Your posts are removed and this cannot be undone."
        yesLabel="Yes, delete it"
        pending={pending}
        onConfirm={() => run()}
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
