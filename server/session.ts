import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * The session for this request, looked up once however many components ask.
 * Uses the short-lived session cookie when there is one, so it usually costs no database trip.
 */
export const getAuthSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Same, but always asks the database. Use where a suspended user or removed admin must be turned away at once. */
export const getFreshAuthSession = cache(async () => auth.api.getSession({ headers: await headers(), query: { disableCookieCache: true } }));
