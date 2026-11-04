"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Draws nothing. It keeps the short-lived session cookie fresh while someone is signed in, so pages can read
 * who they are from the cookie instead of asking the database (about 0.7 s) every time.
 */
export function SessionKeeper() {
  authClient.useSession();
  return null;
}
