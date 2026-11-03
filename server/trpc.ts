import "server-only";
import { initTRPC, TRPCError } from "@trpc/server";
import type { PhotoStorage } from "@/server/photos/storage";

export type SessionUser = { id: string; name: string; role: "user" | "admin"; banned: boolean };
export type Context = { user: SessionUser | null; storage: PhotoStorage };

const t = initTRPC.context<Context>().create();

export const router = t.router;

/** Anyone, signed in or not. Only for approved listings and other public data. */
export const publicProcedure = t.procedure;

/** Signed-in, not suspended. New procedures should start here. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in." });
  if (ctx.user.banned) throw new TRPCError({ code: "FORBIDDEN", message: "Your account is paused." });
  return next({ ctx: { user: ctx.user } });
});

/** Signed-in admins only. */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "This is for admins only." });
  return next({ ctx });
});
