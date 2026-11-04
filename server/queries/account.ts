import "server-only";
import { REJECTION_MESSAGES, type RejectionReason } from "@/constants/moderation";
import type { Queryable } from "@/server/db";
import { publicName } from "@/server/queries/listing-public";
import type { BookingRequest, BookingStatus, ListingStatus, MyBooking, MyListing } from "@/types/account";

const ISO = `'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'`;
type Row = Record<string, unknown>;

const rejection = (r: Row): string | undefined =>
  r.rejection_reason ? [REJECTION_MESSAGES[r.rejection_reason as RejectionReason], r.rejection_note].filter(Boolean).join(" ") : undefined;

/** The owner's listings, with the people who asked. Only this owner's rows: the owner id is in the query. */
export async function getOwnerListings(db: Queryable, ownerId: string, onlyId?: string): Promise<MyListing[]> {
  const [listings, requests] = await Promise.all([db.query(
    `SELECT id, title, category, area, dzongkhag, status, rejection_reason, rejection_note, to_char(created_at AT TIME ZONE 'UTC', ${ISO}) AS created_at
       FROM listing WHERE owner_id = $1 AND deleted_at IS NULL AND ($2::uuid IS NULL OR id = $2) ORDER BY created_at DESC, id DESC`,
    [ownerId, onlyId ?? null],
  ), db.query(
    `SELECT b.id, b.listing_id, b.status, b.phone, b.note, u.name, to_char(b.created_at AT TIME ZONE 'UTC', ${ISO}) AS created_at
       FROM booking b JOIN listing l ON l.id = b.listing_id JOIN "user" u ON u.id = b.requester_id
      WHERE l.owner_id = $1 AND b.status <> 'cancelled' ORDER BY b.created_at`,
    [ownerId],
  )]);
  return listings.rows.map((l) => ({
    id: l.id, name: l.title, category: l.category, area: l.area, dzongkhag: l.dzongkhag, postedAt: l.created_at,
    status: l.status as ListingStatus, rejectionReason: rejection(l),
    requests: requests.rows.filter((b) => b.listing_id === l.id).map((b): BookingRequest => ({
      id: b.id, name: publicName(b.name), phone: b.phone, note: b.note ?? undefined, status: b.status as BookingStatus, requestedAt: b.created_at,
    })),
  }));
}

/** The seeker's own requests. The giver's phone appears only once the giver accepted. */
export async function getSeekerBookings(db: Queryable, requesterId: string, onlyId?: string): Promise<MyBooking[]> {
  const { rows } = await db.query(
    `SELECT b.id, b.listing_id, b.status, l.title, l.area, l.dzongkhag,
            CASE WHEN b.status = 'accepted' THEN l.contact_phone END AS giver_phone,
            CASE WHEN b.status = 'accepted' THEN l.address_private END AS pickup_note,
            to_char(b.created_at AT TIME ZONE 'UTC', ${ISO}) AS created_at
       FROM booking b JOIN listing l ON l.id = b.listing_id
      WHERE b.requester_id = $1 AND ($2::uuid IS NULL OR b.id = $2) ORDER BY b.created_at DESC, b.id DESC`,
    [requesterId, onlyId ?? null],
  );
  return rows.map((r) => ({
    id: r.id, itemId: r.listing_id, itemName: r.title, area: r.area, dzongkhag: r.dzongkhag, status: r.status as BookingStatus,
    requestedAt: r.created_at, giverPhone: r.giver_phone ?? undefined, pickupNote: r.pickup_note ?? undefined,
  }));
}

/** How many requests are waiting for this giver's answer. One small query, for the menu badge. */
export async function countOpenRequestsFor(db: Queryable, ownerId: string): Promise<number> {
  const { rows } = await db.query(
    `SELECT count(*)::int AS n FROM booking b JOIN listing l ON l.id = b.listing_id WHERE l.owner_id = $1 AND b.status = 'requested' AND l.deleted_at IS NULL`,
    [ownerId],
  );
  return rows[0].n;
}
