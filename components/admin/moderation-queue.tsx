import { ModerationList } from "@/components/admin/moderation-list";
import { serverCaller } from "@/server/caller";

/** Loads the first page of pending listings. Reads cookies, so render inside Suspense. */
export async function ModerationQueue() {
  const initial = await (await serverCaller()).admin.moderation.queue({ limit: 20 });
  return <ModerationList initial={initial} />;
}
