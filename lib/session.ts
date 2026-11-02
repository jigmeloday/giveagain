import { SAMPLE_USER } from "@/constants/sample-account";
import type { User } from "@/types/account";

/**
 * Stand-in for the Better Auth session. Returns null when signed out.
 * Replace the body with the real lookup (it will read cookies, so callers sit inside Suspense).
 */
export async function getSession(): Promise<{ user: User } | null> {
  return { user: SAMPLE_USER };
}
