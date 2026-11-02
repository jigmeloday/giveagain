"use client";

import { Field } from "@/components/shares/field";
import { Select as SelectRoot, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps, SelectOption } from "@/types/field";

type SelectProps = FieldProps & {
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
};

export function Select({
  label, hint, error, required, id, className, options, placeholder = "Choose one", value, onValueChange, ...props
}: SelectProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <SelectRoot
        items={options}
        required={required}
        value={value === undefined ? undefined : value || null}
        onValueChange={(value) => onValueChange?.(value ?? "")}
        {...props}
      >
        <SelectTrigger id={ids.id} aria-invalid={ids.invalid || undefined} aria-describedby={ids.describedBy}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}
