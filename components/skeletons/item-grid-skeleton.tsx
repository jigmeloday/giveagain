import { ItemGridCells } from "@/components/skeletons/item-grid-cells";
import { Region } from "@/components/skeletons/region";

/** Fallback for a grid of items. */
export function ItemGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Region>
      <ItemGridCells count={count} />
    </Region>
  );
}
