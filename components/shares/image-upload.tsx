"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Field } from "@/components/shares/field";
import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_TYPES, MAX_LISTING_PHOTOS } from "@/constants/images";
import { useFieldIds } from "@/hooks/use-field-ids";
import { useImageUpload } from "@/hooks/use-image-upload";
import type { FieldProps } from "@/types/field";

type ImageUploadProps = FieldProps & {
  id?: string;
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  className?: string;
};

export function ImageUpload({ label, hint, error, required, id, className, files, onChange, max = MAX_LISTING_PHOTOS }: ImageUploadProps) {
  const ids = useFieldIds(id, hint, error);
  const { inputRef, items, notice, onPick, open, remove, full } = useImageUpload({ files, max, onChange });

  return (
    <Field ids={ids} label={label} hint={hint} error={error ?? notice} required={required} className={className}>
      <input
        ref={inputRef}
        id={ids.id}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        aria-describedby={ids.describedBy}
        aria-invalid={ids.invalid || undefined}
        tabIndex={-1}
        onChange={onPick}
      />
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map(({ key, url }, index) => (
          <li key={key} className="relative aspect-square border border-line bg-mist">
            {url && <Image src={url} alt={`Photo ${index + 1}`} fill unoptimized sizes="160px" className="object-cover" />}
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => remove(index)}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </li>
        ))}
        {!full && (
          <li>
            <button
              type="button"
              onClick={open}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 border border-dashed border-input text-[13px] font-bold hover:bg-mist focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ImagePlus aria-hidden className="size-5" />
              {files.length === 0 ? "Add photos" : "Add more"}
            </button>
          </li>
        )}
      </ul>
    </Field>
  );
}
