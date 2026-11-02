"use client";

import { Controller, type Control, type ControllerRenderProps, type FieldPath, type FieldValues } from "react-hook-form";

type FormFieldProps<T extends FieldValues, N extends FieldPath<T>> = {
  control: Control<T>;
  name: N;
  render: (props: { field: ControllerRenderProps<T, N>; error?: string }) => React.ReactElement;
};

/** Connects a controlled shared input (Select, Combobox, RadioGroup, PhoneInput, ...) to react-hook-form. */
export function FormField<T extends FieldValues, N extends FieldPath<T>>({ control, name, render }: FormFieldProps<T, N>) {
  return (
    <Controller control={control} name={name} render={({ field, fieldState }) => render({ field, error: fieldState.error?.message })} />
  );
}
