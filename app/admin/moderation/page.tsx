import type { Metadata } from "next";
import { Suspense } from "react";
import { ModerationQueue } from "@/components/admin/moderation-queue";

export const metadata: Metadata = { title: "Moderation | GiveAgain admin" };

export default function ModerationPage() {
  return (
    <>
      <div className="flex flex-col gap-2 border-b border-line p-6 sm:p-10">
        <h2 className="text-[clamp(32px,4vw,48px)]">Moderation</h2>
        <p className="max-w-xl text-muted-foreground">New posts, oldest first. Approve what&rsquo;s fine, or tell the owner kindly what to fix.</p>
      </div>
      <Suspense fallback={<p role="status" className="p-6 text-muted-foreground sm:p-10">Loading…</p>}>
        <ModerationQueue />
      </Suspense>
    </>
  );
}
