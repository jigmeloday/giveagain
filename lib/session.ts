import "server-only";
import { getAuthSession, getFreshAuthSession } from "@/server/session";
import type { User } from "@/types/account";

const DEFAULT_SETTINGS: User["settings"] = {
  notify: { requests: true, answers: true, nearby: true, weekly: false },
  privacy: { firstNameOnly: true, showGiven: true },
};

export type Session = { user: User; role: "user" | "admin" };

/**
 * The signed-in user, or null (also null when suspended). Reads cookies, so callers sit inside Suspense.
 * Pass `fresh` where a suspension must apply immediately (the admin area).
 */
export async function getSession({ fresh = false }: { fresh?: boolean } = {}): Promise<Session | null> {
  const session = await (fresh ? getFreshAuthSession() : getAuthSession());
  if (!session || session.user.banned) return null;
  const { id, name, email, role } = session.user;
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return {
    role: role === "admin" ? "admin" : "user",
    // Phone, place and the rest of the profile aren't stored yet, so they start empty.
    user: { id, firstName, lastInitial: rest.at(-1)?.[0]?.toUpperCase() ?? "", about: "", email, phone: "", dzongkhag: "", settings: DEFAULT_SETTINGS },
  };
}
