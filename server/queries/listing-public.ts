import "server-only";
import { escapeLike } from "@/server/like";
import type { Queryable } from "@/server/db";
import type { Listing, ListingFilters } from "@/types/listing";

const ISO = `'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'`;
/** Only approved listings are ever public. This is in the query itself, not filtered afterwards. */
const PUBLIC = `l.status IN ('available', 'reserved') AND l.deleted_at IS NULL`;

export type UrlFor = (key: string) => string;
export type Cursor = { createdAt: string; id: string };
export type ListingPage = { items: Listing[]; nextCursor: Cursor | null };

/** "Pema Dorji" to "Pema D." Never the full name. */
export function publicName(name: string): string {
  const [first, ...rest] = name.trim().split(/\s+/);
  const initial = rest.at(-1)?.[0];
  return initial ? `${first} ${initial.toUpperCase()}.` : first;
}

type Row = Record<string, string | number | null>;

function toListing(r: Row, urlFor: (key: string) => string): Listing {
  return {
    id: r.id as string, name: r.title as string, description: r.description as string,
    category: r.category as Listing["category"], condition: r.condition as Listing["condition"],
    dzongkhag: r.dzongkhag as Listing["dzongkhag"], area: r.area as string, postedAt: r.created_at as string,
    status: r.status as Listing["status"], askingCount: r.asking as number,
    size: (r.size as string) || undefined, collection: (r.collection as string) || undefined, headsUp: (r.heads_up as string) || undefined,
    photos: (r.photo_keys as unknown as string[]).map(urlFor),
    giver: { name: publicName(r.owner_name as string), given: r.given as number, since: r.owner_since as string },
  };
}

const SELECT = `
  SELECT l.id, l.title, l.description, l.category, l.condition, l.dzongkhag, l.area, l.status, l.size, l.collection, l.heads_up,
         to_char(l.created_at AT TIME ZONE 'UTC', ${ISO}) AS created_at,
         u.name AS owner_name, to_char(u."createdAt" AT TIME ZONE 'UTC', ${ISO}) AS owner_since,
         (SELECT count(*)::int FROM booking b WHERE b.listing_id = l.id AND b.status = 'requested') AS asking,
         (SELECT count(*)::int FROM listing g WHERE g.owner_id = l.owner_id AND g.status = 'given') AS given,
         COALESCE((SELECT array_agg(p.key ORDER BY p.position) FROM listing_photo p WHERE p.listing_id = l.id), '{}') AS photo_keys
    FROM listing l JOIN "user" u ON u.id = l.owner_id`;

const filterClause = (n: number) => `
  AND ($${n}::text IS NULL OR l.category = $${n})
  AND ($${n + 1}::text IS NULL OR l.dzongkhag = $${n + 1})
  AND ($${n + 2}::text IS NULL OR l.condition = $${n + 2})
  AND ($${n + 3}::text IS NULL OR l.title ILIKE '%' || $${n + 3} || '%' ESCAPE '\\' OR l.description ILIKE '%' || $${n + 3} || '%' ESCAPE '\\')`;

const filterParams = (f: ListingFilters) => [f.category ?? null, f.dzongkhag ?? null, f.condition ?? null, f.q?.trim() ? escapeLike(f.q.trim()) : null];

/** Newest first, with keyset pagination on (created_at, id). */
export async function listPublic(db: Queryable, filters: ListingFilters, limit: number, urlFor: UrlFor, cursor?: Cursor): Promise<ListingPage> {
  const { rows } = await db.query(
    `${SELECT} WHERE ${PUBLIC} ${filterClause(1)}
       AND ($5::timestamptz IS NULL OR (l.created_at, l.id) < ($5::timestamptz, $6::uuid))
     ORDER BY l.created_at DESC, l.id DESC LIMIT $7`,
    [...filterParams(filters), cursor?.createdAt ?? null, cursor?.id ?? null, limit + 1],
  );
  const items = rows.slice(0, limit).map((r) => toListing(r, urlFor));
  const last = items.at(-1);
  return { items, nextCursor: rows.length > limit && last ? { createdAt: last.postedAt, id: last.id } : null };
}

export async function getPublic(db: Queryable, id: string, urlFor: UrlFor): Promise<Listing | null> {
  const { rows } = await db.query(`${SELECT} WHERE l.id = $1 AND ${PUBLIC}`, [id]);
  return rows[0] ? toListing(rows[0], urlFor) : null;
}

/** Category counts for the filter sidebar. Ignores the chosen category so each option shows what it would give. */
export async function countCategories(db: Queryable, filters: ListingFilters) {
  const { rows } = await db.query(
    `SELECT l.category, count(*)::int AS n FROM listing l WHERE ${PUBLIC} ${filterClause(1)} GROUP BY l.category`,
    filterParams({ ...filters, category: undefined }),
  );
  return rows.map((r) => ({ category: r.category as string, count: r.n as number }));
}

export type ViewerState = { signedIn: boolean; isOwner: boolean; requested: boolean };

/** What the signed-in visitor can do on this item: own it, or already have asked. */
export async function getViewerState(db: Queryable, listingId: string, userId: string | null): Promise<ViewerState> {
  if (!userId) return { signedIn: false, isOwner: false, requested: false };
  const { rows } = await db.query(
    `SELECT l.owner_id = $2 AS is_owner,
            EXISTS (SELECT 1 FROM booking b WHERE b.listing_id = l.id AND b.requester_id = $2 AND b.status <> 'cancelled') AS requested
       FROM listing l WHERE l.id = $1`,
    [listingId, userId],
  );
  return { signedIn: true, isOwner: Boolean(rows[0]?.is_owner), requested: Boolean(rows[0]?.requested) };
}
