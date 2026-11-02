"use client";

import type { StepProps } from "@/components/give/step-types";
import { FormField } from "@/components/shares/form-field";
import { ImageUpload } from "@/components/shares/image-upload";
import { MIN_LISTING_PHOTOS } from "@/constants/images";

export function StepPhotos({ control }: Pick<StepProps, "control">) {
  return (
    <FormField control={control} name="photos" render={({ field, error }) => (
      <ImageUpload
        label="Photos"
        hint={`Add at least ${MIN_LISTING_PHOTOS}: the whole item first, then close-ups. The first one is the cover. Daylight works best.`}
        required
        error={error}
        files={field.value}
        onChange={field.onChange}
      />
    )} />
  );
}
