import { Field } from "@/components/shares/field";
import { Textarea as TextareaPrimitive } from "@/components/ui/textarea";
import { useFieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

export type TextareaProps = FieldProps & React.ComponentProps<"textarea">;

export function Textarea({ label, hint, error, required, id, className, ...props }: TextareaProps) {
  const ids = useFieldIds(id, hint, error);

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <TextareaPrimitive
        id={ids.id}
        required={required}
        aria-invalid={ids.invalid || undefined}
        aria-describedby={ids.describedBy}
        {...props}
      />
    </Field>
  );
}
