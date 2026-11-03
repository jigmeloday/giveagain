import { StatTile } from "@/components/admin/stat-tile";
import { formatDate } from "@/lib/format";
import { serverCaller } from "@/server/caller";

export async function DashboardStats() {
  const s = await (await serverCaller()).admin.dashboard();

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-8 xl:grid-cols-3">
      <StatTile
        label="Waiting for review"
        value={s.pendingListings}
        attention
        href="/admin/moderation"
        note={s.oldestPendingAt ? `Oldest posted ${formatDate(s.oldestPendingAt)}` : "Nothing waiting. Well done!"}
      />
      <StatTile label="Live on the site" value={s.liveListings} note="Available or reserved" />
      <StatTile label="Given away" value={s.givenListings} note="Things that found a home" />
      <StatTile label="Open reports" value={s.openReports} note="Reports page coming soon" />
      <StatTile label="People" value={s.users} note={`${s.suspendedUsers} suspended`} />
    </div>
  );
}
