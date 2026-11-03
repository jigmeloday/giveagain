import "server-only";
import { z } from "zod";
import { CATEGORIES, CONDITIONS } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { MAX_LISTING_PHOTOS, MIN_LISTING_PHOTOS } from "@/constants/images";
import { isOwnPhotoKey } from "@/server/photos/upload";
import { giveListingSchema } from "@/schemas/listing";
import { pool, withTransaction } from "@/server/db";
import { MAX_PAGE_SIZE } from "@/server/limits";
import { createListing, markGiven, withdrawListing } from "@/server/queries/listing-owner";
import { countCategories, getPublic, getViewerState, listPublic } from "@/server/queries/listing-public";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const filters = {
  q: z.string().max(100).optional(),
  category: z.enum(CATEGORIES).optional(),
  dzongkhag: z.enum(DZONGKHAGS).optional(),
  condition: z.enum(CONDITIONS).optional(),
};

const createInput = giveListingSchema.omit({ photos: true }).extend({
  photos: z.array(z.strictObject({ key: z.string().max(200), width: z.number().int().min(1).max(20000), height: z.number().int().min(1).max(20000) })).min(MIN_LISTING_PHOTOS, `Add at least ${MIN_LISTING_PHOTOS} photos.`).max(MAX_LISTING_PHOTOS),
}).strict();
const id = z.strictObject({ id: z.uuid() });

export const listingRouter = router({
  list: publicProcedure
    .input(z.strictObject({
      ...filters,
      limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(24),
      cursor: z.strictObject({ createdAt: z.iso.datetime({ precision: 6 }), id: z.uuid() }).optional(),
    }))
    .query(({ ctx, input: { limit, cursor, ...rest } }) => listPublic(pool, rest, limit, ctx.storage.url, cursor)),

  categoryCounts: publicProcedure
    .input(z.strictObject(filters))
    .query(async ({ input }) => {
      const counts = await countCategories(pool, input);
      return { all: counts.reduce((sum, c) => sum + c.count, 0), byCategory: CATEGORIES.map((category) => ({ category, count: counts.find((c) => c.category === category)?.count ?? 0 })) };
    }),

  byId: publicProcedure.input(id).query(async ({ ctx, input }) => {
    const listing = await getPublic(pool, input.id, ctx.storage.url);
    if (!listing) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that item." });
    return { listing, viewer: await getViewerState(pool, input.id, ctx.user?.id ?? null) };
  }),

  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input: { photos, ...input } }) => {
      const keys = photos.map((p) => p.key);
      const own = keys.every((key) => isOwnPhotoKey(key, ctx.user.id)) && new Set(keys).size === keys.length;
      const stored = own && (await Promise.all(keys.map((key) => ctx.storage.exists(key)))).every(Boolean);
      if (!stored) throw new TRPCError({ code: "BAD_REQUEST", message: "One of your photos didn't upload. Please add it again." });
      return withTransaction((client) => createListing(client, ctx.user.id, input, photos));
    }),

  markGiven: protectedProcedure.input(id).mutation(({ ctx, input }) => withTransaction((client) => markGiven(client, input.id, ctx.user.id))),

  withdraw: protectedProcedure.input(id).mutation(({ ctx, input }) => withTransaction((client) => withdrawListing(client, input.id, ctx.user.id))),
});
