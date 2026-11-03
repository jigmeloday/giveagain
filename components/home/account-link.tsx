import Link from "next/link";
import { getSession } from "@/lib/session";

const LINK = "hidden text-sm font-medium hover:underline sm:inline";

/** "My account" (and "Admin" for admins) when signed in, "Sign in" otherwise. Reads the session, so render inside Suspense. */
export async function AccountLink() {
  const session = await getSession();
  if (!session) return <Link href="/sign-in" className={LINK}>Sign in</Link>;
  return (
    <>
      {session.role === "admin" && <Link href="/admin" className={LINK}>Admin</Link>}
      <Link href="/account" className={LINK}>My account</Link>
    </>
  );
}
