import { appRouter } from "@/server/routers/_app";
import type { SessionUser } from "@/server/trpc";
import { makeFakeStorage } from "./fake-storage";

/** Calls the API as this user (or as a signed-out visitor with null), with no HTTP server and a fake photo store. */
export function callerFor(user: SessionUser | null, storage = makeFakeStorage()) {
  return appRouter.createCaller({ user, storage });
}
