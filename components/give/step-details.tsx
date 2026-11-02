"use client";

import type { StepProps } from "@/components/give/step-types";
import { ChoiceCards } from "@/components/shares/choice-cards";
import { FormField } from "@/components/shares/form-field";
import { Input } from "@/components/shares/input";
import { SegmentedChoice } from "@/components/shares/segmented-choice";
import { Textarea } from "@/components/shares/textarea";
import { CONDITION_OPTIONS } from "@/constants/give";
import { CATEGORIES } from "@/constants/listing";

export function StepDetails({ control, register, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <Input label="What is it?" placeholder="Three-seat sofa, grey linen" required error={errors.title?.message} {...register("title")} />
      <FormField control={control} name="category" render={({ field, error }) => (
        <SegmentedChoice label="Category" options={CATEGORIES} required error={error} value={field.value} onValueChange={field.onChange} />
      )} />
      <FormField control={control} name="condition" render={({ field, error }) => (
        <ChoiceCards label="Condition" options={CONDITION_OPTIONS} required error={error} value={field.value} onValueChange={field.onChange} />
      )} />
      <Textarea label="Tell people about it" hint="Any marks, how comfortable it is, why you're giving it away." required rows={4} error={errors.description?.message} {...register("description")} />
      <Input label="Size (optional)" placeholder="210 × 90 × 85 cm" error={errors.size?.message} {...register("size")} />
    </div>
  );
}
