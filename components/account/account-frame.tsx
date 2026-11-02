import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { countOpenRequests, getMyListings } from "@/lib/account";
import { getSession } from "@/lib/session";

/** Signed-in area: checks the session, then shows the side menu. Reads the session, so render inside Suspense. */
export async function AccountFrame({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/account");
  const openRequests = countOpenRequests(await getMyListings());

  return (
    <div className="grid md:grid-cols-[17rem_1fr]">
      <div className="border-b-2 border-line md:border-r-2 md:border-b-0">
        <div className="flex flex-col gap-4 p-4 sm:p-8 md:sticky md:top-0">
          <h1 className="text-3xl tracking-[-0.03em]">Your account</h1>
          <AccountNav
            tabs={[
              { label: "Profile", href: "/account" },
              { label: "I'm giving", href: "/account/listings", badge: openRequests },
              { label: "I asked for", href: "/account/bookings" },
              { label: "Help", href: "/how-it-works" },
            ]}
          />
        </div>
      </div>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
