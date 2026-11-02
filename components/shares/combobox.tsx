"use client";

import { Field } from "@/components/shares/field";
import {
  Combobox as ComboboxRoot,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useFieldIds } from "@/hooks/use-field-ids";
import { useOptionSelection } from "@/hooks/use-option-selection";
import type { FieldProps, SelectOption } from "@/types/field";

type ComboboxProps = FieldProps & {
  options: SelectOption[];
  placeholder?: string;
  emptyText?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
};

/** A select you can type into. Use it when the list is long (Dzongkhags, areas). */
export function Combobox({
  label, hint, error, required, id, className, options, placeholder = "Start typing", emptyText = "Nothing found.",
  value, defaultValue, name, disabled, onValueChange,
}: ComboboxProps) {
  const ids = useFieldIds(id, hint, error);
  const { selected, defaultSelected } = useOptionSelection(options, value, defaultValue);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <ComboboxRoot
        items={options}
        value={selected}
        defaultValue={defaultSelected}
        name={name}
        disabled={disabled}
        required={required}
        onValueChange={(option) => onValueChange?.(option?.value ?? "")}
      >
        <ComboboxInput
          id={ids.id}
          placeholder={placeholder}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
        />
        <ComboboxContent>
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(option: SelectOption) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    </Field>
  );
}
