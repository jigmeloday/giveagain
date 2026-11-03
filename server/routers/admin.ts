import "server-only";
import { z } from "zod";
import { REJECTION_REASON_VALUES } from "@/constants/moderation";
import { pool, withTransaction } from "@/server/db";
import { getDashboardStats } from "@/server/queries/dashboard";
import { getModerationQueue, reviewListing } from "@/server/queries/moderation";
import { adminProcedure, router } from "@/server/trpc";

const MAX_PAGE = 50;

const moderation = router({
  queue: adminProcedure
    .input(z.strictObject({
      limit: z.number().int().min(1).max(MAX_PAGE).default(20),
      cursor: z.strictObject({ createdAt: z.iso.datetime({ precision: 6 }), id: z.uuid() }).optional(),
    }))
    .query(({ ctx, input }) => getModerationQueue(pool, input.limit, ctx.storage.url, input.cursor)),

  approve: adminProcedure
    .input(z.strictObject({ id: z.uuid() }))
    .mutation(({ ctx, input }) => withTransaction((client) => reviewListing(client, { id: input.id, adminId: ctx.user.id, outcome: "approve" }))),

  reject: adminProcedure
    .input(z.strictObject({ id: z.uuid(), reason: z.enum(REJECTION_REASON_VALUES), note: z.string().trim().max(300).optional() }))
    .mutation(({ ctx, input }) =>
      withTransaction((client) => reviewListing(client, { id: input.id, adminId: ctx.user.id, outcome: "reject", reason: input.reason, note: input.note }))),
});

export const adminRouter = router({
  dashboard: adminProcedure.query(() => getDashboardStats(pool)),
  moderation,
});
