import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

/** Browser client for the API. Mutations here run the same server checks as everywhere else. */
export const trpc = createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: "/api/trpc" })] });

const SHOWN = new Set(["CONFLICT", "NOT_FOUND"]);

/** Turns an API failure into a short, safe message. Raw server errors are never shown. */
export function friendlyError(error: unknown): Error {
  if (error instanceof TRPCClientError) {
    const code = error.data?.code as string | undefined;
    if (code && SHOWN.has(code)) return new Error(error.message);
    if (code === "UNAUTHORIZED") return new Error("Please sign in again.");
    if (code === "FORBIDDEN") return new Error("You can't do that.");
    if (code === "BAD_REQUEST") return new Error("Please check what you entered.");
  }
  return new Error("Something went wrong. Please try again.");
}
