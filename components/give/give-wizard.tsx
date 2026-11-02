"use client";

import { FormError } from "@/components/auth/form-error";
import { GiveDone } from "@/components/give/give-done";
import { GiveNav } from "@/components/give/give-nav";
import { GivePreview } from "@/components/give/give-preview";
import { GiveStepBar } from "@/components/give/give-step-bar";
import { StepDetails } from "@/components/give/step-details";
import { StepPhotos } from "@/components/give/step-photos";
import { StepPickup } from "@/components/give/step-pickup";
import { StepReview } from "@/components/give/step-review";
import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useGiveWizard } from "@/hooks/use-give-wizard";

export function GiveWizard({ onClose }: { onClose: () => void }) {
  const { form, step, goTo, back, submit, formError, done, isSubmitting } = useGiveWizard();
  const { control, register, formState: { errors } } = form;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-col gap-6 border-b-2 border-line px-6 pt-6 pb-4 sm:px-10">
        <SheetTitle className="pr-12 text-[clamp(32px,5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">Give something away</SheetTitle>
        <SheetDescription className="sr-only">Free to take. A volunteer checks every post before it goes live.</SheetDescription>
        {!done && <GiveStepBar step={step} />}
      </header>
      {done ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-10"><GiveDone onClose={onClose} /></div>
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_28rem]">
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-col gap-8 overflow-y-auto p-6 sm:p-10">
            <div className="flex max-w-2xl flex-1 flex-col gap-8">
              <FormError message={formError} />
              {step === 0 && <StepPhotos control={control} />}
              {step === 1 && <StepDetails control={control} register={register} errors={errors} />}
              {step === 2 && <StepPickup control={control} register={register} errors={errors} />}
              {step === 3 && <StepReview control={control} goTo={goTo} />}
            </div>
            <GiveNav step={step} pending={isSubmitting} onBack={back} />
          </form>
          <GivePreview control={control} />
        </div>
      )}
    </div>
  );
}
