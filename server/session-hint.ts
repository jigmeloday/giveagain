import "server-only";
import { cookies } from "next/headers";

const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

/** The part of the cookie store we need. Lets tests pass a plain object. */
export type CookieLookup = { has(name: string): boolean };

export const hasSessionCookieIn = (store: CookieLookup): boolean => SESSION_COOKIES.some((name) => store.has(name));

/**
 * "Does this browser carry a sign-in cookie?" Instant: no database. A hint for what to DRAW (links, buttons) only.
 * It does not prove the session is still valid, so never use it to allow anything. The server checks for real.
 */
export async function hasSessionCookie(): Promise<boolean> {
  return hasSessionCookieIn(await cookies());
}
