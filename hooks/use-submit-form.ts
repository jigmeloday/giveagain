import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { z } from "zod";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

type Options<T extends FieldValues> = {
  schema: z.ZodType<T, T>;
  defaultValues: DefaultValues<T>;
  submit: (values: T) => Promise<void>;
  onDone?: () => void;
};

/** Form state for submit-style forms: validation, a top-level error, and a done flag. */
export function useSubmitForm<T extends FieldValues>({ schema, defaultValues, submit, onDone }: Options<T>) {
  const [formError, setFormError] = useState<string>();
  const [done, setDone] = useState(false);
  const form = useForm<T, unknown, T>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(undefined);
    try {
      await submit(values);
      setDone(true);
      onDone?.();
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : FALLBACK_ERROR);
    }
  });

  return { form, onSubmit, formError, done, isSubmitting: form.formState.isSubmitting };
}
