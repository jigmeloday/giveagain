"use client";

import { Check } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import { ItemPhoto } from "@/components/shares/item-photo";
import { GOOD_LISTING_TIPS } from "@/constants/give";
import { fileUrl } from "@/lib/file-url";
import type { GiveListingOutput } from "@/schemas/listing";

/** Right-hand side of the Give sheet: a live card of how the item will look, plus a few tips. */
export function GivePreview({ control }: { control: Control<GiveListingOutput> }) {
  const { photos, title, category, condition, area, dzongkhag } = useWatch({ control });
  const meta = [category, condition].filter(Boolean).join(" · ");
  const place = [area, dzongkhag].filter(Boolean).join(", ");

  return (
    <aside aria-label="Preview" className="hidden flex-col gap-8 border-l-2 border-line bg-mist p-10 lg:flex">
      <p className="text-muted-foreground">How neighbours will see it</p>
      <div className="flex flex-col gap-4 bg-background p-5">
        <ItemPhoto src={fileUrl(photos?.[0])} alt="Cover photo" sizes="400px" className="aspect-[4/3]" />
        <div className="flex flex-col gap-2">
          <p className="flex justify-between gap-3 text-sm">
            <span className="text-primary-ink">{meta || "Category · Condition"}</span>
            <span className="text-muted-foreground">{place}</span>
          </p>
          <p className="text-2xl font-extrabold leading-tight tracking-[-0.03em]">{title || "Your item"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t-2 border-foreground pt-6">
        <h2 className="text-2xl tracking-[-0.03em]">No price field. On purpose.</h2>
        <p>Everything on GiveAgain is free. If someone offers money, you can politely say no, or report it.</p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground">Good listings</p>
        <ul className="flex flex-col gap-3">
          {GOOD_LISTING_TIPS.map((tip) => (
            <li key={tip} className="flex items-center gap-3">
              <Check aria-hidden className="size-5 shrink-0 text-primary-ink" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
