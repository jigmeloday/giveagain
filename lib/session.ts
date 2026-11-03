import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { User } from "@/types/account";

const DEFAULT_SETTINGS: User["settings"] = {
  notify: { requests: true, answers: true, nearby: true, weekly: false },
  privacy: { firstNameOnly: true, showGiven: true },
};

export type Session = { user: User; role: "user" | "admin" };

/** The signed-in user, or null (also null when suspended). Reads cookies, so callers sit inside Suspense. */
export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.banned) return null;
  const { id, name, email, role } = session.user;
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return {
    role: role === "admin" ? "admin" : "user",
    // Phone, place and the rest of the profile aren't stored yet, so they start empty.
    user: { id, firstName, lastInitial: rest.at(-1)?.[0]?.toUpperCase() ?? "", about: "", email, phone: "", dzongkhag: "", settings: DEFAULT_SETTINGS },
  };
}
