import { notFound, redirect } from "next/navigation";
import { SideMenuLayout } from "@/components/shares/side-menu-layout";
import { getSession } from "@/lib/session";
import { serverCaller } from "@/server/caller";

/** Admin area: signed-out visitors go to sign in, everyone else who isn't an admin sees "not found". Render inside Suspense. */
export async function AdminFrame({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/admin");
  if (session.role !== "admin") notFound();
  const { pendingListings } = await (await serverCaller()).admin.dashboard();

  return (
    <SideMenuLayout
      title="Admin"
      tabs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Moderation", href: "/admin/moderation", badge: pendingListings },
      ]}
    >
      {children}
    </SideMenuLayout>
  );
}
