"use client";

import type { Control } from "react-hook-form";
import { SettingToggle } from "@/components/account/setting-toggle";
import { FormField } from "@/components/shares/form-field";
import type { NOTIFY_TOGGLES, PRIVACY_TOGGLES } from "@/constants/settings";
import type { ProfileInput } from "@/schemas/profile";

type ToggleListProps = {
  control: Control<ProfileInput>;
  toggles: typeof NOTIFY_TOGGLES | typeof PRIVACY_TOGGLES;
};

/** A list of on/off settings wired to the profile form. */
export function ToggleList({ control, toggles }: ToggleListProps) {
  return (
    <div>
      {toggles.map((toggle) => (
        <FormField
          key={toggle.key}
          control={control}
          name={`${toggle.group}.${toggle.key}` as never}
          render={({ field }) => <SettingToggle label={toggle.label} hint={toggle.hint} checked={Boolean(field.value)} onChange={field.onChange} />}
        />
      ))}
    </div>
  );
}
