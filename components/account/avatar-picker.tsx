"use client";

import { useRef } from "react";
import Image from "next/image";
import { PhotoPlaceholder } from "@/components/shares/photo-placeholder";
import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/images";
import { usePreviewUrl } from "@/hooks/use-preview-url";

type AvatarPickerProps = { file: File | null; onChange: (file: File | null) => void };

export function AvatarPicker({ file, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { url, pick } = usePreviewUrl(onChange);

  return (
    <div className="flex items-center gap-5">
      {url && file ? (
        <div className="relative size-24 shrink-0 bg-mist">
          <Image src={url} alt="Your photo" fill unoptimized sizes="96px" className="object-cover" />
        </div>
      ) : (
        <PhotoPlaceholder caption="" className="size-24 shrink-0" />
      )}
      <div className="flex flex-col gap-3">
        <p>A friendly photo helps neighbours trust who they&rsquo;re meeting.</p>
        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a photo"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>Change photo</Button>
          {file && <button type="button" onClick={() => pick(null)} className="font-bold text-primary-ink hover:underline">Remove</button>}
        </div>
      </div>
    </div>
  );
}
