"use client";

import { useId } from "react";
import { Field } from "@/components/shares/field";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

type SegmentedChoiceProps = FieldProps & {
  options: readonly string[];
  value?: string;
  onValueChange: (value: string) => void;
  id?: string;
};

/** A short row of choices joined together; the picked one is filled. Native radios, so the keyboard works. */
export function SegmentedChoice({ label, hint, error, required, id, options, value, onValueChange }: SegmentedChoiceProps) {
  const ids = useFieldIds(id, hint, error);
  const name = useId();

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} group>
      <div className="flex flex-wrap border border-input">
        {options.map((option) => (
          <label
            key={option}
            className="flex h-11 cursor-pointer items-center border-r border-input px-4 last:border-r-0 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-ring"
          >
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onValueChange(option)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </Field>
  );
}
