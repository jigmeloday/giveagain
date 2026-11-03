"use client";

import { ModerationActions } from "@/components/admin/moderation-actions";
import { ItemPhoto } from "@/components/shares/item-photo";
import { formatDate } from "@/lib/format";
import type { QueueItem } from "@/server/queries/moderation";

type ModerationCardProps = { item: QueueItem; onReviewed: () => void };

export function ModerationCard({ item, onReviewed }: ModerationCardProps) {
  const { owner } = item;
  const details = [item.size, item.collection, item.headsUp].filter(Boolean);

  return (
    <li className="flex flex-col gap-4 border border-line bg-card p-5">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink">{item.category} · {item.condition}</p>
        <h2 className="text-2xl tracking-[-0.02em]">{item.title}</h2>
        <p className="text-sm text-muted-foreground">{item.area}, {item.dzongkhag} · Posted {formatDate(item.createdAt)}</p>
      </div>
      <p className="max-w-prose">{item.description}</p>
      {details.length > 0 && <p className="text-sm text-muted-foreground">{details.join(" · ")}</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {item.photoUrls.length > 0
          ? item.photoUrls.map((src, i) => <ItemPhoto key={src} src={src} alt={`${item.title}, photo ${i + 1}`} sizes="160px" className="aspect-square" />)
          : <p className="col-span-full text-sm text-muted-foreground">No photos.</p>}
      </div>
      <p className="border-t border-line pt-3 text-sm">
        <span className="font-bold">{owner.name}</span>
        <span className="text-muted-foreground"> · joined {formatDate(owner.joinedAt)} · {owner.approvedCount} approved · {owner.rejectedCount} rejected · {owner.openReports} open reports</span>
      </p>
      <ModerationActions id={item.id} onReviewed={onReviewed} />
    </li>
  );
}
