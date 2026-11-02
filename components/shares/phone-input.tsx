"use client";

import { Field } from "@/components/shares/field";
import { Input as InputPrimitive } from "@/components/ui/input";
import { useFieldIds } from "@/hooks/use-field-ids";
import { BHUTAN_DIAL_CODE, groupDigits, nationalDigits, withDialCode } from "@/lib/phone-format";
import type { FieldProps } from "@/types/field";

type PhoneInputProps = FieldProps &
  Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
    /** Country code plus number, e.g. "+97517123456". */
    value?: string;
    onChange?: (value: string) => void;
  };

// Only Bhutan (+975) for now; the code cell is where a country picker will go.
export function PhoneInput({ label, hint, error, required, id, className, value = "", onChange, ...props }: PhoneInputProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex">
        <span
          aria-hidden
          className="flex h-11 shrink-0 items-center border border-r-0 border-input bg-mist px-3 font-mono text-sm font-bold"
        >
          {BHUTAN_DIAL_CODE}
        </span>
        <InputPrimitive
          id={ids.id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          placeholder="17 12 34 56"
          value={groupDigits(nationalDigits(value))}
          onChange={(event) => onChange?.(withDialCode(event.target.value))}
          {...props}
        />
      </div>
    </Field>
  );
}
