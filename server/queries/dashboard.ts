import "server-only";
import type { Queryable } from "@/server/db";

export type DashboardStats = {
  pendingListings: number;
  /** ISO time of the oldest listing still waiting, or null when the queue is empty. */
  oldestPendingAt: string | null;
  liveListings: number;
  givenListings: number;
  openReports: number;
  users: number;
  suspendedUsers: number;
};

export async function getDashboardStats(db: Queryable): Promise<DashboardStats> {
  const [listings, reports, users] = await Promise.all([
    db.query(`
      SELECT
        count(*) FILTER (WHERE status = 'pending')::int AS pending,
        min(created_at) FILTER (WHERE status = 'pending') AS oldest_pending,
        count(*) FILTER (WHERE status IN ('available', 'reserved'))::int AS live,
        count(*) FILTER (WHERE status = 'given')::int AS given
      FROM listing WHERE deleted_at IS NULL`),
    db.query(`SELECT count(*)::int AS open FROM report WHERE status = 'open'`),
    db.query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE banned)::int AS suspended FROM "user"`),
  ]);
  const l = listings.rows[0];
  return {
    pendingListings: l.pending,
    oldestPendingAt: l.oldest_pending ? new Date(l.oldest_pending).toISOString() : null,
    liveListings: l.live,
    givenListings: l.given,
    openReports: reports.rows[0].open,
    users: users.rows[0].total,
    suspendedUsers: users.rows[0].suspended,
  };
}
