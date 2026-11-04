import { cache } from "react";
import { serverCaller } from "@/server/caller";

/** The dashboard numbers, fetched once per request even though the menu badge and the page both need them. */
export const getDashboard = cache(async () => (await serverCaller({ fresh: true })).admin.dashboard());
