import { useId } from "react";

export type FieldIds = {
  id: string;
  hintId?: string;
  errorId?: string;
  describedBy?: string;
  invalid: boolean;
};

export function useFieldIds(idProp: string | undefined, hint?: string, error?: string): FieldIds {
  const generated = useId();
  const id = idProp ?? generated;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return { id, hintId, errorId, describedBy, invalid: Boolean(error) };
}
