"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { AvatarPicker } from "@/components/account/avatar-picker";
import { Combobox } from "@/components/shares/combobox";
import { FormField } from "@/components/shares/form-field";
import { Input } from "@/components/shares/input";
import { PhoneInput } from "@/components/shares/phone-input";
import { Textarea } from "@/components/shares/textarea";
import { DZONGKHAG_OPTIONS } from "@/constants/give";
import type { ProfileInput } from "@/schemas/profile";

type ProfileFieldsProps = {
  control: Control<ProfileInput>;
  register: UseFormRegister<ProfileInput>;
  errors: FieldErrors<ProfileInput>;
  email: string;
};

export function ProfileFields({ control, register, errors, email }: ProfileFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <FormField control={control} name="photo" render={({ field }) => <AvatarPicker file={field.value} onChange={field.onChange} />} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" autoComplete="given-name" required error={errors.firstName?.message} {...register("firstName")} />
        <Input label="Last initial" maxLength={1} autoComplete="off" required error={errors.lastInitial?.message} {...register("lastInitial")} />
      </div>
      <Textarea label="A little about you" error={errors.about?.message} {...register("about")} />
      <FormField control={control} name="dzongkhag" render={({ field, error }) => (
        <Combobox label="Where you live" hint="Only the area is shown, never your address." options={DZONGKHAG_OPTIONS} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
      )} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" value={email} readOnly hint="This is the email you sign in with." />
        <FormField control={control} name="phone" render={({ field, error }) => (
          <PhoneInput label="Phone (optional)" hint="Shared only with the person you give to, or the giver you ask." error={error} value={field.value} onChange={field.onChange} />
        )} />
      </div>
    </div>
  );
}
