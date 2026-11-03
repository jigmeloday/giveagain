import "server-only";
import { env } from "@/lib/env";

/** Browsers always send Origin on cross-site POSTs. Reject writes that come from any site but ours. */
export function isAllowedOrigin(request: Request, allowed: string = new URL(env.BETTER_AUTH_URL).origin): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const origin = request.headers.get("origin");
  return origin === null || origin === allowed;
}
