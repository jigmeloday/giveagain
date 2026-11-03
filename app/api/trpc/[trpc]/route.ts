import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/server/context";
import { isAllowedOrigin } from "@/server/origin";
import { appRouter } from "@/server/routers/_app";

function handler(request: Request) {
  if (!isAllowedOrigin(request)) return new Response("Forbidden", { status: 403 });
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createContext(request.headers),
  });
}

export { handler as GET, handler as POST };
