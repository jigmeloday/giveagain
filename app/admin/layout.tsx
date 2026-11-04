import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";
import { FrameSkeleton } from "@/components/skeletons/frame-skeleton";
import { SiteShell } from "@/components/shares/site-shell";

export const metadata: Metadata = { title: "Admin | GiveAgain", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <Suspense fallback={<FrameSkeleton />}>
        <AdminFrame>{children}</AdminFrame>
      </Suspense>
    </SiteShell>
  );
}
