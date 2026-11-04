import { redirect } from "next/navigation";
import { SideMenuLayout } from "@/components/shares/side-menu-layout";
import { getOpenRequestCount } from "@/lib/account";
import { getSession } from "@/lib/session";

/** Signed-in area: checks the session, then shows the side menu. Reads the session, so render inside Suspense. */
export async function AccountFrame({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/account");
  const openRequests = await getOpenRequestCount();

  return (
    <SideMenuLayout
      title="Your account"
      tabs={[
        { label: "Profile", href: "/account" },
        { label: "I'm giving", href: "/account/listings", badge: openRequests },
        { label: "I asked for", href: "/account/bookings" },
        { label: "Help", href: "/how-it-works" },
      ]}
    >
      {children}
    </SideMenuLayout>
  );
}
