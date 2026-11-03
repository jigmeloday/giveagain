"use client";

import { ModerationCard } from "@/components/admin/moderation-card";
import { EmptyState } from "@/components/shares/empty-state";
import { Button } from "@/components/ui/button";
import { useModerationQueue } from "@/hooks/use-moderation-queue";
import type { QueuePage } from "@/server/queries/moderation";

export function ModerationList({ initial }: { initial: QueuePage }) {
  const { items, hasMore, more, reviewed } = useModerationQueue(initial);

  if (items.length === 0 && !hasMore) {
    return <EmptyState title="Nothing is waiting." body="Every post has been reviewed. New ones will show up here." />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-8">
      <ul className="grid items-start gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <ModerationCard key={item.id} item={item} onReviewed={() => reviewed(item.id)} />
        ))}
      </ul>
      {hasMore && (
        <div className="flex flex-col items-start gap-2">
          <Button type="button" variant="outline" disabled={more.pending} onClick={() => more.run()}>{more.pending ? "Loading…" : "Show more"}</Button>
          {more.error && <p role="alert" className="text-destructive">{more.error}</p>}
        </div>
      )}
    </div>
  );
}
