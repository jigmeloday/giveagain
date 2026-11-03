import "server-only";
import { TRPCError } from "@trpc/server";
import type pg from "pg";
import { MAX_ACTIVE_LISTINGS, MAX_PENDING_LISTINGS } from "@/server/limits";
import type { Queryable } from "@/server/db";
import type { GiveListingOutput } from "@/schemas/listing";

type NewListing = Omit<GiveListingOutput, "photos" | "agree">;
export type NewPhoto = { key: string; width: number; height: number };

/** Creates a listing for this owner. Always starts as pending; the client can't pick the status. */
export async function createListing(client: pg.PoolClient, ownerId: string, input: NewListing, photos: NewPhoto[]): Promise<{ id: string }> {
  // Serialise one owner's creates so two quick requests can't both slip under the cap.
  await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [`listing-create:${ownerId}`]);
  const counts = (await client.query(
    `SELECT count(*) FILTER (WHERE status = 'pending')::int AS pending,
            count(*) FILTER (WHERE status IN ('pending', 'available', 'reserved'))::int AS active
       FROM listing WHERE owner_id = $1 AND deleted_at IS NULL`,
    [ownerId],
  )).rows[0];
  if (counts.pending >= MAX_PENDING_LISTINGS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "A few of your posts are still being checked. Please wait for them before posting more." });
  if (counts.active >= MAX_ACTIVE_LISTINGS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have a lot of things posted already. Mark some as given first." });

  const { rows } = await client.query(
    `INSERT INTO listing (owner_id, title, description, category, condition, dzongkhag, area, size, collection, heads_up, contact_phone, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NULLIF($8, ''), NULLIF($9, ''), NULLIF($10, ''), $11, 'pending') RETURNING id`,
    [ownerId, input.title, input.description, input.category, input.condition, input.dzongkhag, input.area, input.size, input.collection, input.headsUp, input.phone],
  );
  const id: string = rows[0].id;
  try {
    for (const [position, photo] of photos.entries()) {
      await client.query(`INSERT INTO listing_photo (listing_id, key, position, width, height) VALUES ($1, $2, $3, $4, $5)`, [id, photo.key, position, photo.width, photo.height]);
    }
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new TRPCError({ code: "BAD_REQUEST", message: "One of those photos is already used. Please add it again." });
    throw error;
  }
  return { id };
}

/** Locks the listing if it belongs to this owner. Anyone else gets "not found", never "forbidden". */
async function lockOwned(client: pg.PoolClient, id: string, ownerId: string): Promise<string> {
  const { rows } = await client.query(`SELECT status FROM listing WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL FOR UPDATE`, [id, ownerId]);
  if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that listing." });
  return rows[0].status;
}

export async function markGiven(client: pg.PoolClient, id: string, ownerId: string): Promise<void> {
  const status = await lockOwned(client, id, ownerId);
  if (status !== "available" && status !== "reserved") throw new TRPCError({ code: "CONFLICT", message: "Only things that are online can be marked as given." });
  await client.query(`UPDATE listing SET status = 'given' WHERE id = $1`, [id]);
  await client.query(`UPDATE booking SET status = 'declined' WHERE listing_id = $1 AND status = 'requested'`, [id]);
}

export async function withdrawListing(client: pg.PoolClient, id: string, ownerId: string): Promise<void> {
  const status = await lockOwned(client, id, ownerId);
  if (!["pending", "available", "reserved"].includes(status)) throw new TRPCError({ code: "CONFLICT", message: "This post can't be taken down any more." });
  await client.query(`UPDATE listing SET status = 'withdrawn' WHERE id = $1`, [id]);
  await client.query(`UPDATE booking SET status = CASE WHEN status = 'accepted' THEN 'cancelled' ELSE 'declined' END WHERE listing_id = $1 AND status IN ('requested', 'accepted')`, [id]);
}

export const countOpenRequestsFor = (db: Queryable, userId: string) =>
  db.query(`SELECT count(*)::int AS n FROM booking WHERE requester_id = $1 AND status = 'requested'`, [userId]);
