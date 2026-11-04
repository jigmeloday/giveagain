import { createAuthClient } from "better-auth/react";

/** Browser side of Better Auth. Same-origin, so no base URL needed. */
export const authClient = createAuthClient({
  // Re-checks every 45 s and when you come back to the tab, which also renews the 60-second session cookie copy.
  sessionOptions: { refetchInterval: 45, refetchOnWindowFocus: true },
});
