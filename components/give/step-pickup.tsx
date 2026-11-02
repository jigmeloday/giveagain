"use client";

import type { StepProps } from "@/components/give/step-types";
import { Combobox } from "@/components/shares/combobox";
import { FormField } from "@/components/shares/form-field";
import { Input } from "@/components/shares/input";
import { PhoneInput } from "@/components/shares/phone-input";
import { DZONGKHAG_OPTIONS } from "@/constants/give";

export function StepPickup({ control, register, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField control={control} name="dzongkhag" render={({ field, error }) => (
          <Combobox label="Dzongkhag" options={DZONGKHAG_OPTIONS} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
        )} />
        <Input label="Area or neighbourhood" placeholder="Motithang" hint="Never your street or house." required error={errors.area?.message} {...register("area")} />
      </div>
      <Input label="When can people collect it? (optional)" placeholder="Weekday evenings, weekends" error={errors.collection?.message} {...register("collection")} />
      <Input label="Anything to know first? (optional)" placeholder="Needs two people to carry" error={errors.headsUp?.message} {...register("headsUp")} />
      <FormField control={control} name="phone" render={({ field, error }) => (
        <PhoneInput label="Phone number" hint="Only the person you choose will see it." required error={error} value={field.value} onChange={field.onChange} />
      )} />
    </div>
  );
}
