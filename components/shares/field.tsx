import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FieldIds } from "@/hooks/use-field-ids";
import type { FieldProps } from "@/types/field";

type FieldWrapperProps = Omit<FieldProps, "label"> & {
  ids: FieldIds;
  label?: string;
  /** The control draws its own label beside itself (checkbox, switch); only hint and error are added. */
  inline?: boolean;
  /** Use a fieldset and legend for controls made of several inputs (radio groups). */
  group?: boolean;
  className?: string;
  children: React.ReactNode;
};

const titleClass = "text-sm font-bold text-foreground";

export function Field({ ids, label, hint, error, required, group, inline, className, children }: FieldWrapperProps) {
  const marker = required ? (
    <span aria-hidden className="text-primary-ink">
      *
    </span>
  ) : null;

  const messages = (
    <>
      {hint && (
        <p id={ids.hintId} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.errorId} role="alert" className="flex items-start gap-1.5 text-[13px] font-bold text-destructive">
          <CircleAlert aria-hidden className="mt-px size-4 shrink-0" />
          {error}
        </p>
      )}
    </>
  );

  if (group) {
    return (
      <fieldset className={cn("flex min-w-0 flex-col gap-2", className)}>
        <legend className={cn(titleClass, "mb-2 flex gap-1 p-0")}>
          {label}
          {marker}
        </legend>
        {children}
        {messages}
      </fieldset>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      {!inline && (
        <Label htmlFor={ids.id} className={titleClass}>
          {label}
          {marker}
        </Label>
      )}
      {children}
      {messages}
    </div>
  );
}
