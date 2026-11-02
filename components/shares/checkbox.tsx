"use client";

import { Field } from "@/components/shares/field";
import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

type CheckboxProps = FieldProps & {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ label, hint, error, required, id, className, onCheckedChange, ...props }: CheckboxProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} hint={hint} error={error} className={className} inline>
      <div className="flex items-start gap-3">
        <CheckboxPrimitive
          id={ids.id}
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          onCheckedChange={(checked) => onCheckedChange?.(checked)}
          className="mt-0.5"
          {...props}
        />
        <Label htmlFor={ids.id} className="text-base leading-snug font-normal">
          {label}
        </Label>
      </div>
    </Field>
  );
}
