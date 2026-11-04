import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import type { BetterAuthOptions } from "better-auth";

/**
 * Better Auth settings, kept apart from the database connection so the migration script can read them.
 * Plain relative imports only: scripts run this file directly with Node.
 */
export function authOptions(database: BetterAuthOptions["database"]) {
  return {
    database,
    // Pages read a signed copy of the session from a cookie for up to a minute instead of asking the database on every
    // request (each trip is ~330 ms from Bhutan to Neon). Anything that changes data, and the admin area, still checks
    // the database every time (see server/session.ts), so a suspension takes effect immediately there.
    session: { cookieCache: { enabled: true, maxAge: 60 } },
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    // `role` defaults to "user" and clients can never set it; `banned` is how suspension blocks sign-in and sessions.
    plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] }), nextCookies()],
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 5 },
        "/request-password-reset": { window: 60, max: 3 },
      },
    },
  } satisfies BetterAuthOptions;
}
