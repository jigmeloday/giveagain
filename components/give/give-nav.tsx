import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import { GIVE_STEPS } from "@/constants/give";

type GiveNavProps = { step: number; pending: boolean; onBack: () => void };

export function GiveNav({ step, pending, onBack }: GiveNavProps) {
  return (
    <div className="flex items-center gap-3 border-t-2 border-line pt-6">
      {step > 0 && <Button type="button" variant="outline" size="lg" onClick={onBack} className="h-14 px-6 text-base">Back</Button>}
      <SubmitButton label={GIVE_STEPS[step].next} pending={pending} className="w-fit min-w-64" />
    </div>
  );
}
