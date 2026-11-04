import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountFrame } from "@/components/account/account-frame";
import { FrameSkeleton } from "@/components/skeletons/frame-skeleton";
import { SiteShell } from "@/components/shares/site-shell";

export const metadata: Metadata = { robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <Suspense fallback={<FrameSkeleton />}>
        <AccountFrame>{children}</AccountFrame>
      </Suspense>
    </SiteShell>
  );
}
