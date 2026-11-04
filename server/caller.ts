import "server-only";
import { toSessionUser } from "@/server/context";
import { storage } from "@/server/photos/storage";
import { appRouter } from "@/server/routers/_app";
import { getAuthSession, getFreshAuthSession } from "@/server/session";

/**
 * Calls the API from a server component as the signed-in user, with the same checks as over HTTP.
 * Reads of the user's own pages use the short-lived session cookie; pass `fresh` to always ask the database.
 */
export async function serverCaller({ fresh = false }: { fresh?: boolean } = {}) {
  const user = toSessionUser(await (fresh ? getFreshAuthSession() : getAuthSession()));
  return appRouter.createCaller({ user, storage });
}
