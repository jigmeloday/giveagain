import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { hasSessionCookie } from "@/server/session-hint";

const LINK = "hidden text-sm font-medium hover:underline sm:inline";

/** Only for admins. Needs to know the role, so it may arrive a moment after the rest of the bar. */
async function AdminLink() {
  const session = await getSession();
  return session?.role === "admin" ? <Link href="/admin" className={LINK}>Admin</Link> : null;
}

/** "My account" when the browser carries a sign-in cookie, "Sign in" otherwise. Render inside Suspense. */
export async function AccountLink() {
  if (!(await hasSessionCookie())) return <Link href="/sign-in" className={LINK}>Sign in</Link>;
  return (
    <>
      <Suspense fallback={null}>
        <AdminLink />
      </Suspense>
      <Link href="/account" className={LINK}>My account</Link>
    </>
  );
}
