import { Field } from "@/components/shares/field";
import { Input as InputPrimitive } from "@/components/ui/input";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

export type InputProps = FieldProps & React.ComponentProps<"input">;

export function Input({ label, hint, error, required, id, className, ...props }: InputProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <InputPrimitive
        id={ids.id}
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={ids.describedBy}
        {...props}
      />
    </Field>
  );
}
