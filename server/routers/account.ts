import "server-only";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { pool } from "@/server/db";
import { getOwnerListings, getSeekerBookings } from "@/server/queries/account";
import { protectedProcedure, router } from "@/server/trpc";

const id = z.strictObject({ id: z.uuid() });
const notFound = () => new TRPCError({ code: "NOT_FOUND", message: "We can't find that." });

/** Everything here is scoped to the signed-in user inside the query, so nobody can read someone else's rows by guessing an id. */
export const accountRouter = router({
  myListings: protectedProcedure.query(({ ctx }) => getOwnerListings(pool, ctx.user.id)),
  myListing: protectedProcedure.input(id).query(async ({ ctx, input }) => (await getOwnerListings(pool, ctx.user.id, input.id))[0] ?? Promise.reject(notFound())),
  myBookings: protectedProcedure.query(({ ctx }) => getSeekerBookings(pool, ctx.user.id)),
  myBooking: protectedProcedure.input(id).query(async ({ ctx, input }) => (await getSeekerBookings(pool, ctx.user.id, input.id))[0] ?? Promise.reject(notFound())),
});
