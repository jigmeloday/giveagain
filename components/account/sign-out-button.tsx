"use client";

import { useRouter } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { accountActions } from "@/lib/account-actions";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { run, pending, error } = useAction(async () => {
    await accountActions.signOut();
    router.push("/");
  });

  return (
    <>
      <button type="button" disabled={pending} onClick={() => run()} className={className}>
        {pending ? "Please wait…" : "Sign out"}
      </button>
      {error && <span role="alert" className="text-sm text-destructive">{error}</span>}
    </>
  );
}
