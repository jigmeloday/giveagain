import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "@/hooks/use-action";
import { friendlyError, trpc } from "@/lib/trpc-client";
import type { QueuePage } from "@/server/queries/moderation";

/** The review list on screen: removes a card once it's reviewed and loads more on request. */
export function useModerationQueue(initial: QueuePage) {
  const router = useRouter();
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);

  const more = useAction(async () => {
    if (!cursor) return;
    const page = await trpc.admin.moderation.queue.query({ cursor }).catch((e) => { throw friendlyError(e); });
    setItems((current) => [...current, ...page.items]);
    setCursor(page.nextCursor);
  });

  function reviewed(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    router.refresh();
  }

  return { items, hasMore: cursor !== null, more, reviewed };
}
