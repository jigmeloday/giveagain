import Link from "next/link";
import { getSession } from "@/lib/session";

/** "My account" when signed in, "Sign in" otherwise. Reads the session, so render inside Suspense. */
export async function AccountLink() {
  const session = await getSession();
  return (
    <Link href={session ? "/account" : "/sign-in"} className="hidden text-sm font-medium hover:underline sm:inline">
      {session ? "My account" : "Sign in"}
    </Link>
  );
}
