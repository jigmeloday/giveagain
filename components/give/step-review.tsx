"use client";

import { useWatch } from "react-hook-form";
import { ReviewRow } from "@/components/give/review-row";
import type { StepProps } from "@/components/give/step-types";
import { Checkbox } from "@/components/shares/checkbox";
import { FormField } from "@/components/shares/form-field";
import { formatPhone } from "@/lib/phone-format";

type StepReviewProps = Pick<StepProps, "control"> & { goTo: (step: number) => void };

export function StepReview({ control, goTo }: StepReviewProps) {
  const v = useWatch({ control });

  return (
    <div className="flex flex-col gap-8">
      <dl className="border-t border-line">
        <ReviewRow term="Photos" value={`${v.photos?.length ?? 0} added`} onChange={() => goTo(0)} />
        <ReviewRow term="Item" value={[v.title, [v.category, v.condition].filter(Boolean).join(" · ")].filter(Boolean).join(" — ")} onChange={() => goTo(1)} />
        <ReviewRow term="About it" value={v.description ?? ""} onChange={() => goTo(1)} />
        <ReviewRow term="Where" value={[v.area, v.dzongkhag].filter(Boolean).join(", ")} onChange={() => goTo(2)} />
        <ReviewRow term="Collection" value={[v.collection, v.headsUp].filter(Boolean).join(" · ")} onChange={() => goTo(2)} />
        <ReviewRow term="Phone" value={v.phone ? formatPhone(v.phone) : ""} onChange={() => goTo(2)} />
      </dl>
      <FormField control={control} name="agree" render={({ field, error }) => (
        <Checkbox label="I confirm this item is free to take." error={error} checked={field.value} onCheckedChange={field.onChange} />
      )} />
      <p className="text-sm text-muted-foreground">A volunteer checks every post before it goes live. This usually takes a day.</p>
    </div>
  );
}
