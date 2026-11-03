import "server-only";
import { TRPCError } from "@trpc/server";
import type { RejectionReason } from "@/constants/moderation";
import type { Queryable } from "@/server/db";
import type pg from "pg";

export type QueueItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  dzongkhag: string;
  area: string;
  size: string | null;
  collection: string | null;
  headsUp: string | null;
  createdAt: string;
  photoUrls: string[];
  /** Who posted it. No email or phone: reviewers don't need them. */
  owner: { id: string; name: string; joinedAt: string; approvedCount: number; rejectedCount: number; openReports: number };
};

export type QueuePage = { items: QueueItem[]; nextCursor: { createdAt: string; id: string } | null };

const ISO = `'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'`;

/** Pending listings, oldest first. Keyset pagination on (created_at, id). */
export async function getModerationQueue(db: Queryable, limit: number, urlFor: (key: string) => string, cursor?: { createdAt: string; id: string }): Promise<QueuePage> {
  const { rows } = await db.query(
    `SELECT l.id, l.title, l.description, l.category, l.condition, l.dzongkhag, l.area, l.size, l.collection, l.heads_up,
            to_char(l.created_at AT TIME ZONE 'UTC', ${ISO}) AS created_at,
            u.id AS owner_id, u.name AS owner_name, to_char(u."createdAt" AT TIME ZONE 'UTC', ${ISO}) AS owner_joined,
            (SELECT count(*)::int FROM listing x WHERE x.owner_id = l.owner_id AND x.moderated_at IS NOT NULL AND x.status IN ('available', 'reserved', 'given')) AS approved_count,
            (SELECT count(*)::int FROM listing x WHERE x.owner_id = l.owner_id AND x.status = 'rejected') AS rejected_count,
            (SELECT count(*)::int FROM report r WHERE r.target_type = 'user' AND r.target_id = l.owner_id AND r.status = 'open') AS open_reports,
            COALESCE((SELECT array_agg(p.key ORDER BY p.position) FROM listing_photo p WHERE p.listing_id = l.id), '{}') AS photo_keys
       FROM listing l
       JOIN "user" u ON u.id = l.owner_id
      WHERE l.status = 'pending' AND l.deleted_at IS NULL
        AND ($1::timestamptz IS NULL OR (l.created_at, l.id) > ($1::timestamptz, $2::uuid))
      ORDER BY l.created_at, l.id
      LIMIT $3`,
    [cursor?.createdAt ?? null, cursor?.id ?? null, limit + 1],
  );
  const page = rows.slice(0, limit);
  const items: QueueItem[] = page.map((r) => ({
    id: r.id, title: r.title, description: r.description, category: r.category, condition: r.condition,
    dzongkhag: r.dzongkhag, area: r.area, size: r.size, collection: r.collection, headsUp: r.heads_up,
    createdAt: r.created_at, photoUrls: (r.photo_keys as string[]).map(urlFor),
    owner: { id: r.owner_id, name: r.owner_name, joinedAt: r.owner_joined, approvedCount: r.approved_count, rejectedCount: r.rejected_count, openReports: r.open_reports },
  }));
  const last = items.at(-1);
  return { items, nextCursor: rows.length > limit && last ? { createdAt: last.createdAt, id: last.id } : null };
}

type Review = { id: string; adminId: string } & ({ outcome: "approve" } | { outcome: "reject"; reason: RejectionReason; note?: string });

/** Approves or rejects a pending listing and writes the audit entry, all in one transaction. */
export async function reviewListing(client: pg.PoolClient, review: Review): Promise<void> {
  const found = await client.query(`SELECT status FROM listing WHERE id = $1 AND deleted_at IS NULL FOR UPDATE`, [review.id]);
  if (!found.rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "We can't find that listing." });
  if (found.rows[0].status !== "pending") throw new TRPCError({ code: "CONFLICT", message: "Someone already reviewed this listing." });

  const approve = review.outcome === "approve";
  await client.query(
    `UPDATE listing
        SET status = $2, rejection_reason = $3, rejection_note = $4, moderated_by = $5, moderated_at = now()
      WHERE id = $1`,
    [review.id, approve ? "available" : "rejected", approve ? null : review.reason, approve ? null : (review.note || null), review.adminId],
  );
  await client.query(
    `INSERT INTO audit_log (actor_id, action, target_type, target_id, reason, meta) VALUES ($1, $2, 'listing', $3, $4, $5)`,
    [review.adminId, approve ? "listing.approve" : "listing.reject", review.id, approve ? null : review.reason, approve ? null : JSON.stringify({ note: review.note || null })],
  );
}
