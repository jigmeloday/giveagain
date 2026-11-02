import type { SelectOption } from "@/types/field";

/** Maps a string value to its option object, as the combobox wants objects. `undefined` stays uncontrolled. */
export function useOptionSelection(options: SelectOption[], value?: string, defaultValue?: string) {
  const find = (wanted: string) => options.find((option) => option.value === wanted) ?? null;
  return {
    selected: value === undefined ? undefined : find(value),
    defaultSelected: defaultValue === undefined ? undefined : find(defaultValue),
  };
}
