import "server-only";
import { TRPCError } from "@trpc/server";
import type pg from "pg";
import { MAX_OPEN_REQUESTS } from "@/server/limits";

type RequestInput = { listingId: string; requesterId: string; phone: string; note?: string };

/** A seeker asks for an item. Rules: not your own, item must be online, one active request each, capped per person. */
export async function requestListing(client: pg.PoolClient, { listingId, requesterId, phone, note }: RequestInput): Promise<{ id: string }> {
  const found = await client.query(`SELECT owner_id, status FROM listing WHERE id = $1 AND deleted_at IS NULL FOR SHARE`, [listingId]);
  const listing = found.rows[0];
  // Pending, rejected and withdrawn listings are invisible to everyone but their owner and admins.
  if (!listing || !["available", "reserved", "given"].includes(listing.status)) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that item." });
  if (listing.owner_id === requesterId) throw new TRPCError({ code: "FORBIDDEN", message: "You can't ask for your own item." });
  if (listing.status === "given") throw new TRPCError({ code: "CONFLICT", message: "This item has already been given away." });

  await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [`request:${requesterId}`]);
  const open = (await client.query(`SELECT count(*)::int AS n FROM booking WHERE requester_id = $1 AND status = 'requested'`, [requesterId])).rows[0].n;
  if (open >= MAX_OPEN_REQUESTS) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have a lot of open requests. Wait for some answers first." });

  try {
    const { rows } = await client.query(
      `INSERT INTO booking (listing_id, requester_id, phone, note) VALUES ($1, $2, $3, NULLIF($4, '')) RETURNING id`,
      [listingId, requesterId, phone, note ?? ""],
    );
    return { id: rows[0].id };
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new TRPCError({ code: "CONFLICT", message: "You already asked for this item." });
    throw error;
  }
}

/** The giver accepts or declines. Accepting reserves the item and declines everyone else. Only the giver can do this. */
export async function answerRequest(client: pg.PoolClient, bookingId: string, giverId: string, answer: "accepted" | "declined"): Promise<void> {
  const found = await client.query(
    `SELECT b.status AS booking_status, b.listing_id, l.status AS listing_status
       FROM booking b JOIN listing l ON l.id = b.listing_id
      WHERE b.id = $1 AND l.owner_id = $2 AND l.deleted_at IS NULL FOR UPDATE OF b, l`,
    [bookingId, giverId],
  );
  const row = found.rows[0];
  if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that request." });
  if (row.booking_status !== "requested") throw new TRPCError({ code: "CONFLICT", message: "You already answered this request." });
  if (answer === "accepted" && row.listing_status !== "available") throw new TRPCError({ code: "CONFLICT", message: "You already chose someone for this item." });

  await client.query(`UPDATE booking SET status = $2 WHERE id = $1`, [bookingId, answer]);
  if (answer === "accepted") {
    await client.query(`UPDATE booking SET status = 'declined' WHERE listing_id = $1 AND status = 'requested' AND id <> $2`, [row.listing_id, bookingId]);
    await client.query(`UPDATE listing SET status = 'reserved' WHERE id = $1`, [row.listing_id]);
  }
}

/** The seeker cancels their own request. Cancelling an accepted one puts the item back on the site. */
export async function cancelRequest(client: pg.PoolClient, bookingId: string, requesterId: string): Promise<void> {
  const found = await client.query(
    `SELECT b.status, b.listing_id FROM booking b JOIN listing l ON l.id = b.listing_id WHERE b.id = $1 AND b.requester_id = $2 FOR UPDATE OF b, l`,
    [bookingId, requesterId],
  );
  const row = found.rows[0];
  if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that request." });
  if (!["requested", "accepted"].includes(row.status)) throw new TRPCError({ code: "CONFLICT", message: "This request is already closed." });
  await client.query(`UPDATE booking SET status = 'cancelled' WHERE id = $1`, [bookingId]);
  if (row.status === "accepted") await client.query(`UPDATE listing SET status = 'available' WHERE id = $1 AND status = 'reserved'`, [row.listing_id]);
}
