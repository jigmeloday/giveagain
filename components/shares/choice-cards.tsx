"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { Field } from "@/components/shares/field";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps, SelectOption } from "@/types/field";

type ChoiceCardsProps = FieldProps & {
  options: readonly SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  id?: string;
};

/** Big card choices with a title and a line of help. The picked card gets an orange border and a tick. */
export function ChoiceCards({ label, hint, error, required, id, options, value, onValueChange }: ChoiceCardsProps) {
  const ids = useFieldIds(id, hint, error);
  const name = useId();

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} group>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative flex cursor-pointer flex-col gap-1 border border-input p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
          >
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onValueChange(option.value)} className="peer sr-only" />
            <span className="text-lg font-bold">{option.label}</span>
            {option.hint && <span className="text-sm text-muted-foreground peer-checked:text-primary-ink">{option.hint}</span>}
            <Check aria-hidden className="absolute top-4 right-4 hidden size-5 peer-checked:block" />
          </label>
        ))}
      </div>
    </Field>
  );
}
