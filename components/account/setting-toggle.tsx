"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SettingToggleProps = {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** One setting row: bold title and a line of help on the left, the switch on the right. */
export function SettingToggle({ label, hint, checked, onChange }: SettingToggleProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line py-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="text-base font-bold">{label}</Label>
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} aria-describedby={`${id}-hint`} checked={checked} onCheckedChange={(value) => onChange(value)} />
    </div>
  );
}
