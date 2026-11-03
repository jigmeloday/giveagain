import "server-only";
import { connection } from "next/server";
import { storage } from "@/server/photos/storage";
import { appRouter } from "@/server/routers/_app";

/**
 * API caller for public data (no cookies read). Waits for a real request first, so
 * the page shows live listings instead of whatever existed at build time. Use inside Suspense.
 */
export async function publicApi() {
  await connection();
  return appRouter.createCaller({ user: null, storage });
}
