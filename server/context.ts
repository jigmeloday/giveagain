import "server-only";
import { auth } from "@/lib/auth";
import { storage } from "@/server/photos/storage";
import type { Context, SessionUser } from "@/server/trpc";

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export function toSessionUser(session: AuthSession): SessionUser | null {
  if (!session) return null;
  const { id, name, role, banned } = session.user;
  return { id, name, role: role === "admin" ? "admin" : "user", banned: Boolean(banned) };
}

/** Reads the signed-in user from the request. Always asks the database (never the cookie copy), because API calls change data. */
export async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  return toSessionUser(await auth.api.getSession({ headers, query: { disableCookieCache: true } }));
}

export async function createContext(headers: Headers): Promise<Context> {
  return { user: await getSessionUser(headers), storage };
}
