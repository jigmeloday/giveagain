"use client";

import { Checkbox } from "@/components/shares/checkbox";
import { Combobox } from "@/components/shares/combobox";
import { FormField } from "@/components/shares/form-field";
import { ImageUpload } from "@/components/shares/image-upload";
import { Input } from "@/components/shares/input";
import { PhoneInput } from "@/components/shares/phone-input";
import { RadioGroup } from "@/components/shares/radio-group";
import { Select } from "@/components/shares/select";
import { Textarea } from "@/components/shares/textarea";
import { FormError } from "@/components/auth/form-error";
import { GiveDone } from "@/components/give/give-done";
import { Button } from "@/components/ui/button";
import { MIN_LISTING_PHOTOS } from "@/constants/images";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS, DZONGKHAG_OPTIONS } from "@/constants/give";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { listingActions } from "@/lib/listing-actions";
import { giveListingSchema } from "@/schemas/listing";

export function GiveForm({ onClose }: { onClose: () => void }) {
  const { form, onSubmit, formError, done, isSubmitting } = useSubmitForm({
    schema: giveListingSchema,
    defaultValues: { title: "", description: "", phone: "", photos: [], agree: false },
    submit: listingActions.create,
  });
  const { control, register, formState: { errors } } = form;

  if (done) return <GiveDone onClose={onClose} />;

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto flex max-w-xl flex-col gap-6 pb-10">
      <FormError message={formError} />
      <FormField control={control} name="photos" render={({ field, error }) => (
        <ImageUpload label="Photos" hint={`Add at least ${MIN_LISTING_PHOTOS} photos: the whole item, then close-ups. Daylight works best.`} required error={error} files={field.value} onChange={field.onChange} />
      )} />
      <Input label="What is it?" placeholder="Wooden study desk" required error={errors.title?.message} {...register("title")} />
      <FormField control={control} name="category" render={({ field, error }) => (
        <Select label="Category" options={CATEGORY_OPTIONS} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
      )} />
      <FormField control={control} name="condition" render={({ field, error }) => (
        <RadioGroup label="Condition" options={CONDITION_OPTIONS} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
      )} />
      <Textarea label="Tell people about it" hint="Size, any marks, how to carry it." required error={errors.description?.message} {...register("description")} />
      <FormField control={control} name="dzongkhag" render={({ field, error }) => (
        <Combobox label="Where can it be collected?" hint="Only the area is shown, never your address." options={DZONGKHAG_OPTIONS} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
      )} />
      <FormField control={control} name="phone" render={({ field, error }) => (
        <PhoneInput label="Phone number" hint="Only the person you give to will see it." required error={error} value={field.value} onChange={field.onChange} />
      )} />
      <FormField control={control} name="agree" render={({ field, error }) => (
        <Checkbox label="I confirm this item is free to take." error={error} checked={field.value} onCheckedChange={field.onChange} />
      )} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-fit">
        {isSubmitting ? "Sending…" : "Post it for free"}
      </Button>
    </form>
  );
}
