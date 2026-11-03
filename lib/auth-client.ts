import { createAuthClient } from "better-auth/react";

/** Browser side of Better Auth. Same-origin, so no base URL needed. */
export const authClient = createAuthClient();
