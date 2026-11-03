import { MapPin } from "lucide-react";
import { Suspense } from "react";
import { GiverCard } from "@/components/item/giver-card";
import { ItemActions } from "@/components/item/item-actions";
import { ItemFacts } from "@/components/item/item-facts";
import { PostedAgo } from "@/components/item/posted-ago";
import { askingLabel } from "@/lib/asking";
import type { ViewerState } from "@/server/queries/listing-public";
import type { Listing } from "@/types/listing";

const CHIP = "inline-flex h-8 items-center px-3 text-sm";

export function ItemSummary({ item, viewer }: { item: Listing; viewer: ViewerState }) {
  return (
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-wrap gap-2">
        <span className={`${CHIP} bg-primary/10 text-primary-ink`}>{item.category}</span>
        <span className={`${CHIP} bg-mist`}>{askingLabel(item.askingCount)}</span>
      </div>
      <h1 className="text-[clamp(32px,4.5vw,52px)]">{item.name}</h1>
      <p className="flex items-center gap-2">
        <MapPin aria-hidden className="size-4 shrink-0" />
        Collect from {item.area}, {item.dzongkhag}
        <span className="text-muted-foreground">· <Suspense fallback="recently"><PostedAgo postedAt={item.postedAt} /></Suspense></span>
      </p>
      <ItemFacts {...item} />
      <p className="max-w-prose text-lg">{item.description}</p>
      <GiverCard giver={item.giver} />
      <ItemActions id={item.id} giverName={item.giver.name} reserved={item.status === "reserved"} viewer={viewer} />
    </div>
  );
}
