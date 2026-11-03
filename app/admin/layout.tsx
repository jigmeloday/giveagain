import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";
import { SiteShell } from "@/components/shares/site-shell";

export const metadata: Metadata = { title: "Admin | GiveAgain", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <Suspense fallback={<p role="status" className="p-6 text-muted-foreground sm:p-10">Loading…</p>}>
        <AdminFrame>{children}</AdminFrame>
      </Suspense>
    </SiteShell>
  );
}
