"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { FormField } from "@/components/shares/form-field";
import { PhoneInput } from "@/components/shares/phone-input";
import { Textarea } from "@/components/shares/textarea";
import { Button } from "@/components/ui/button";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { friendlyError, trpc } from "@/lib/trpc-client";
import { requestSchema } from "@/schemas/booking";

type AskFormProps = { listingId: string; giverFirstName: string };

/** "Ask for it": opens a small form for the seeker's phone and an optional note. */
export function AskForm({ listingId, giverFirstName }: AskFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { form, onSubmit, formError, done, isSubmitting } = useSubmitForm({
    schema: requestSchema,
    defaultValues: { phone: "", note: "" },
    submit: (values) => trpc.booking.request.mutate({ listingId, ...values }).then(() => undefined, (e) => { throw friendlyError(e); }),
    onDone: () => router.refresh(),
  });
  const { control, register, formState: { errors } } = form;

  if (done) {
    return <p role="status" className="bg-mist p-4 font-bold">Request sent. {giverFirstName} will call you if they choose you.</p>;
  }

  if (!open) {
    return (
      <Button type="button" size="lg" onClick={() => setOpen(true)} className="h-14 justify-between px-5 text-base">
        Ask {giverFirstName} for this &mdash; free
        <ArrowRight aria-hidden />
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 border border-foreground p-5">
      <FormError message={formError} />
      <FormField control={control} name="phone" render={({ field, error }) => (
        <PhoneInput label="Your phone number" hint={`Only ${giverFirstName} will see it, so they can call you.`} required error={error} value={field.value} onChange={field.onChange} />
      )} />
      <Textarea label="A line about why it would help (optional)" rows={3} maxLength={300} error={errors.note?.message} {...register("note")} />
      <SubmitButton label="Send request" pending={isSubmitting} />
    </form>
  );
}
