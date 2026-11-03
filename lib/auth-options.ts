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
