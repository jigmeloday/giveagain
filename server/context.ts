import "server-only";
import { auth } from "@/lib/auth";
import { storage } from "@/server/photos/storage";
import type { Context, SessionUser } from "@/server/trpc";

/** Reads the signed-in user from the request cookies. Returns null when signed out. */
export async function getSessionUser(headers: Headers): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const { id, name, role, banned } = session.user;
  return { id, name, role: role === "admin" ? "admin" : "user", banned: Boolean(banned) };
}

export async function createContext(headers: Headers): Promise<Context> {
  return { user: await getSessionUser(headers), storage };
}
