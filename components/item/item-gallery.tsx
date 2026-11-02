"use client";

import { useState } from "react";
import { ItemPhoto } from "@/components/shares/item-photo";
import { cn } from "@/lib/utils";
import type { ItemPhoto as ItemPhotoType } from "@/types/listing";

/** One large photo with a row of thumbnails underneath. Tap a thumbnail to see it larger. */
export function ItemGallery({ photos }: { photos: ItemPhotoType[] }) {
  const [current, setCurrent] = useState(0);
  const selected = photos[current];

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-8">
      <ItemPhoto {...selected} priority sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[4/3]" />
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Photos">
        {photos.map((photo, i) => (
          <li key={photo.alt}>
            <button
              type="button"
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              aria-pressed={i === current}
              onClick={() => setCurrent(i)}
              className={cn("block w-full border-2 outline-offset-2", i === current ? "border-foreground" : "border-transparent hover:border-line")}
            >
              <ItemPhoto {...photo} sizes="20vw" className="aspect-[4/3]" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
