"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

/** Top-right prompt: "Sign in" on the sign-up page, "Create account" everywhere else. Keeps ?next=. */
export function AuthSwitch() {
  const signingUp = usePathname() === "/sign-up";
  const next = useSearchParams().get("next");
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm sm:inline">{signingUp ? "Already a member?" : "New here?"}</span>
      <Link href={`${signingUp ? "/sign-in" : "/sign-up"}${query}`} className={buttonVariants({ variant: "outline" })}>
        {signingUp ? "Sign in" : "Create account"}
      </Link>
    </div>
  );
}
