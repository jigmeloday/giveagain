import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  playgroundFormSchema,
  type PlaygroundFormInput,
  type PlaygroundFormOutput,
} from "@/schemas/playground-form";

export function useDemoForm() {
  const [sent, setSent] = useState<Omit<PlaygroundFormOutput, "photos">>();
  const form = useForm<PlaygroundFormInput, unknown, PlaygroundFormOutput>({
    resolver: zodResolver(playgroundFormSchema),
    mode: "onTouched",
    defaultValues: { title: "", category: undefined, dzongkhag: undefined, condition: undefined, description: "", phone: "", photos: [], agree: false },
  });

  const onSubmit = form.handleSubmit(async ({ photos, ...values }) => {
    void photos;
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSent(values);
  });

  return { form, onSubmit, sent, isSubmitting: form.formState.isSubmitting };
}
