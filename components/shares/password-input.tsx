"use client";

import { Eye, EyeOff } from "lucide-react";
import { Field } from "@/components/shares/field";
import { Button } from "@/components/ui/button";
import { Input as InputPrimitive } from "@/components/ui/input";
import { useFieldIds } from "@/hooks/use-field-ids";
import { useToggle } from "@/hooks/use-toggle";
import type { InputProps } from "@/components/shares/input";

export function PasswordInput({ label, hint, error, required, id, className, ...props }: Omit<InputProps, "type">) {
  const ids = useFieldIds(id, hint, error);
  const { on: visible, toggle } = useToggle();

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <InputPrimitive
          id={ids.id}
          type={visible ? "text" : "password"}
          required={required}
          aria-invalid={ids.invalid || undefined}
          aria-describedby={ids.describedBy}
          className="pr-12"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={toggle}
          className="absolute top-0 right-0"
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </Field>
  );
}
