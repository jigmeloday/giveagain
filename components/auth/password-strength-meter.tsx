import { passwordStrength } from "@/lib/password-strength";
import { cn } from "@/lib/utils";

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);

  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <div aria-hidden className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={cn("h-1 bg-line", score >= step && "bg-primary")} />
        ))}
      </div>
      <p className="min-h-5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
