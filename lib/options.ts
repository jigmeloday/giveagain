import type { SelectOption } from "@/types/field";

export function toOptions(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}
