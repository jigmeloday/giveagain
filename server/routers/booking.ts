import "server-only";
import { z } from "zod";
import { requestSchema } from "@/schemas/booking";
import { withTransaction } from "@/server/db";
import { answerRequest, cancelRequest, requestListing } from "@/server/queries/booking";
import { protectedProcedure, router } from "@/server/trpc";

const id = z.strictObject({ id: z.uuid() });

export const bookingRouter = router({
  request: protectedProcedure
    .input(requestSchema.extend({ listingId: z.uuid() }))
    .mutation(({ ctx, input }) => withTransaction((client) => requestListing(client, { ...input, requesterId: ctx.user.id }))),

  answer: protectedProcedure
    .input(z.strictObject({ id: z.uuid(), answer: z.enum(["accepted", "declined"]) }))
    .mutation(({ ctx, input }) => withTransaction((client) => answerRequest(client, input.id, ctx.user.id, input.answer))),

  cancel: protectedProcedure.input(id).mutation(({ ctx, input }) => withTransaction((client) => cancelRequest(client, input.id, ctx.user.id))),
});
