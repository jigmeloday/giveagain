"use client";

import { Field } from "@/components/shares/field";
import { Label } from "@/components/ui/label";
import { RadioGroup as RadioGroupPrimitive, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps, SelectOption } from "@/types/field";

type RadioGroupProps = FieldProps & {
  options: SelectOption[];
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({
  label, hint, error, required, id, className, options, onValueChange, ...props
}: RadioGroupProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className} group>
      <RadioGroupPrimitive
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={ids.describedBy}
        onValueChange={(value) => onValueChange?.(String(value))}
        {...props}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <RadioGroupItem id={`${ids.id}-${option.value}`} value={option.value} className="mt-0.5" />
            <Label htmlFor={`${ids.id}-${option.value}`} className="flex-col items-start gap-0.5 text-base leading-snug font-normal">
              {option.label}
              {option.hint && <span className="text-[13px] text-muted-foreground">{option.hint}</span>}
            </Label>
          </div>
        ))}
      </RadioGroupPrimitive>
    </Field>
  );
}
