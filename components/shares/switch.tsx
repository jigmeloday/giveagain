"use client";

import { Field } from "@/components/shares/field";
import { Label } from "@/components/ui/label";
import { Switch as SwitchPrimitive } from "@/components/ui/switch";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

type SwitchProps = FieldProps & {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({ label, hint, error, required, id, className, onCheckedChange, ...props }: SwitchProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} hint={hint} error={error} className={className} inline>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={ids.id} className="text-base leading-snug font-normal">
          {label}
        </Label>
        <SwitchPrimitive
          id={ids.id}
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          onCheckedChange={(checked) => onCheckedChange?.(checked)}
          {...props}
        />
      </div>
    </Field>
  );
}
