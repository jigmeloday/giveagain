"use client";

import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { DeleteAccountButton } from "@/components/account/delete-account-button";
import { ProfileFields } from "@/components/account/profile-fields";
import { SettingsSection } from "@/components/account/settings-section";
import { ToggleList } from "@/components/account/toggle-list";
import { NOTIFY_TOGGLES, PRIVACY_TOGGLES } from "@/constants/settings";
import { useSubmitForm } from "@/hooks/use-submit-form";
import { accountActions } from "@/lib/account-actions";
import { profileSchema, type ProfileInput } from "@/schemas/profile";
import type { User } from "@/types/account";

export function ProfileForm({ user }: { user: User }) {
  const { form, onSubmit, formError, done, isSubmitting } = useSubmitForm({
    schema: profileSchema,
    defaultValues: {
      photo: null,
      firstName: user.firstName,
      lastInitial: user.lastInitial,
      about: user.about,
      phone: user.phone,
      dzongkhag: user.dzongkhag as ProfileInput["dzongkhag"],
      ...user.settings,
    },
    submit: accountActions.saveProfile,
  });
  const { control, register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-4xl flex-col gap-12 p-6 sm:p-10">
      <FormError message={formError} />
      <SettingsSection title="Profile">
        <ProfileFields control={control} register={register} errors={errors} email={user.email} />
      </SettingsSection>
      <SettingsSection title="Tell me when…">
        <ToggleList control={control} toggles={NOTIFY_TOGGLES} />
      </SettingsSection>
      <SettingsSection title="Privacy">
        <ToggleList control={control} toggles={PRIVACY_TOGGLES} />
        <p className="text-sm text-muted-foreground">Your exact address and phone number are never shown publicly.</p>
      </SettingsSection>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-8">
        <div className="flex items-center gap-4">
          <SubmitButton label="Save changes" pending={isSubmitting} className="w-56" />
          {done && <p role="status" className="font-bold text-primary-ink">Saved.</p>}
        </div>
        <DeleteAccountButton />
      </div>
    </form>
  );
}
