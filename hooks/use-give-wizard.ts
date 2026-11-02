import { useState } from "react";
import { GIVE_STEPS } from "@/constants/give";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { listingActions } from "@/lib/listing-actions";
import { giveListingSchema } from "@/schemas/listing";

const LAST = GIVE_STEPS.length - 1;

/** The Give sheet's steps: checks each step's fields before moving on, and posts on the last one. */
export function useGiveWizard() {
  const [step, setStep] = useState(0);
  const { form, onSubmit, formError, done, isSubmitting } = useSubmitForm({
    schema: giveListingSchema,
    defaultValues: { title: "", description: "", size: "", area: "", collection: "", headsUp: "", phone: "", photos: [], agree: false },
    submit: listingActions.create,
  });

  async function next() {
    if (await form.trigger([...GIVE_STEPS[step].fields])) setStep((current) => current + 1);
  }

  /** Enter in a field moves to the next step; only the last step posts. */
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (step < LAST) {
      event.preventDefault();
      return next();
    }
    return onSubmit(event);
  };

  return { form, step, goTo: setStep, back: () => setStep((current) => Math.max(current - 1, 0)), submit, formError, done, isSubmitting };
}
