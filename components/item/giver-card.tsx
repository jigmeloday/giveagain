import { giverInitials, giverSummary } from "@/lib/giver";
import type { Listing } from "@/types/listing";

export function GiverCard({ giver }: { giver: Listing["giver"] }) {
  return (
    <div className="flex items-center gap-4 bg-mist p-4">
      <span aria-hidden className="flex size-12 shrink-0 items-center justify-center bg-foreground font-bold text-background">
        {giverInitials(giver.name)}
      </span>
      <div className="flex flex-col">
        <p className="font-bold">{giver.name}</p>
        <p className="text-sm text-muted-foreground">{giverSummary(giver)}</p>
      </div>
    </div>
  );
}
