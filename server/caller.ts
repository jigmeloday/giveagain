import "server-only";
import { headers } from "next/headers";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";

/** Calls the API from a server component as the signed-in user, with the same checks as over HTTP. */
export async function serverCaller() {
  return appRouter.createCaller(await createContext(await headers()));
}
