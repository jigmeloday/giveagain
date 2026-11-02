import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountFrame } from "@/components/account/account-frame";
import { SiteShell } from "@/components/shares/site-shell";

export const metadata: Metadata = { robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <Suspense fallback={<p role="status" className="p-6 text-muted-foreground sm:p-10">Loading…</p>}>
        <AccountFrame>{children}</AccountFrame>
      </Suspense>
    </SiteShell>
  );
}
